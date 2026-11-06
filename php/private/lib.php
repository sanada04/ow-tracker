<?php

declare(strict_types=1);

// Deployed to ~/ow-php/lib.php, outside the web root.

const OW_OVERFAST_URL = 'https://overfast-api.tekrop.fr';

define('OW_HOME', dirname(__DIR__));
define('OW_CACHE_DIR', OW_HOME . '/ow-cache');

ini_set('log_errors', '1');
ini_set('error_log', OW_HOME . '/logs/php.error.log');

function ow_config(): array
{
    static $config = null;
    if ($config === null) {
        $config = require OW_HOME . '/ow-config/config.php';
    }
    return $config;
}

function ow_json(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Robots-Tag: noindex');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ow_raw_json(string $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Robots-Tag: noindex');
    header('Cache-Control: no-store');
    echo $body;
    exit;
}

function ow_require_method(string ...$allowed): string
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        ow_json(['error' => 'Method not allowed'], 405);
    }
    return $method;
}

/** Rejects cross-site writes. Browsers always send Origin on POST. */
function ow_require_same_origin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array($origin, ow_config()['allowed_origins'], true)) {
        ow_json(['error' => 'Forbidden'], 403);
    }
}

function ow_cache_path(string $group, string $key): string
{
    $dir = OW_CACHE_DIR . '/' . $group;
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }
    return $dir . '/' . sha1($key);
}

function ow_write_atomic(string $path, string $contents): void
{
    $tmp = $path . '.' . bin2hex(random_bytes(4));
    file_put_contents($tmp, $contents);
    rename($tmp, $path);
}

/** Fixed-window limit per client IP. */
function ow_rate_limit(string $bucket, int $limit, int $windowSeconds): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $handle = fopen(ow_cache_path('rate', $bucket . '|' . $ip), 'c+');
    if ($handle === false) {
        return;
    }

    flock($handle, LOCK_EX);
    $state = json_decode((string) stream_get_contents($handle), true);
    $now = time();
    if (!is_array($state) || $now - (int) ($state['start'] ?? 0) >= $windowSeconds) {
        $state = ['start' => $now, 'count' => 0];
    }
    $state['count']++;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, (string) json_encode($state));
    flock($handle, LOCK_UN);
    fclose($handle);

    if ($state['count'] > $limit) {
        header('Retry-After: ' . max(1, $windowSeconds - ($now - $state['start'])));
        ow_json(['error' => 'Too many requests'], 429);
    }
}

/** @return array{0:int,1:string} HTTP status (0 on network failure) and body. */
function ow_http(string $method, string $url, array $headers = [], ?string $body = null, int $timeout = 10): array
{
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_USERAGENT => 'ow-tracker',
    ]);
    if ($body !== null) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
    }
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return [$status, is_string($response) ? $response : ''];
}

/**
 * Cached GET against OverFast. Serves stale data when the upstream fails,
 * and never caches an error response.
 *
 * @return array{0:int,1:string}
 */
function ow_overfast(string $path, int $ttlSeconds): array
{
    $cachePath = ow_cache_path('overfast', $path);
    $cachedAt = is_file($cachePath) ? (int) filemtime($cachePath) : 0;
    if ($cachedAt > 0 && time() - $cachedAt < $ttlSeconds) {
        return [200, (string) file_get_contents($cachePath)];
    }

    [$status, $body] = ow_http('GET', OW_OVERFAST_URL . $path);
    if ($status === 200) {
        ow_write_atomic($cachePath, $body);
        return [200, $body];
    }
    if ($cachedAt > 0 && ($status === 0 || $status >= 500 || $status === 429)) {
        return [200, (string) file_get_contents($cachePath)];
    }
    return [$status === 0 ? 502 : $status, $body];
}

/** @return list<string> */
function ow_hero_keys(): array
{
    [$status, $body] = ow_overfast('/heroes', 86400);
    $heroes = $status === 200 ? json_decode($body, true) : null;
    if (!is_array($heroes)) {
        throw new RuntimeException('Hero list is unavailable');
    }
    return array_column($heroes, 'key');
}

function ow_upstash_request(string $path, array $payload): mixed
{
    $config = ow_config();
    [$status, $body] = ow_http(
        'POST',
        rtrim($config['upstash_url'], '/') . $path,
        ['Authorization: Bearer ' . $config['upstash_token'], 'Content-Type: application/json'],
        (string) json_encode($payload)
    );
    $decoded = json_decode($body, true);
    if ($status !== 200 || !is_array($decoded)) {
        throw new RuntimeException('Upstash request failed with status ' . $status);
    }
    return $decoded;
}

function ow_upstash(array $command): mixed
{
    $response = ow_upstash_request('', $command);
    if (isset($response['error'])) {
        throw new RuntimeException('Upstash command failed');
    }
    return $response['result'] ?? null;
}

/** @return list<mixed> */
function ow_upstash_pipeline(array $commands): array
{
    $results = [];
    foreach (ow_upstash_request('/pipeline', $commands) as $response) {
        if (isset($response['error'])) {
            throw new RuntimeException('Upstash pipeline failed');
        }
        $results[] = $response['result'] ?? null;
    }
    return $results;
}

/** Upstash returns HGETALL as a flat [field, value, ...] list. */
function ow_hash_to_counts(mixed $flat): array
{
    $counts = [];
    if (is_array($flat)) {
        for ($i = 0; $i + 1 < count($flat); $i += 2) {
            $counts[(string) $flat[$i]] = max(0, (int) $flat[$i + 1]);
        }
    }
    return $counts;
}
