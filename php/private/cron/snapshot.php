<?php

declare(strict_types=1);

// Daily hero stats snapshot, run by cron:
//   php ~/ow-php/cron/snapshot.php
// OverFast only returns current values, so history must be saved as it happens.

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/lib.php';

const SNAPSHOT_TTL_SECONDS = 60 * 60 * 24 * 400;
const CACHE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

$date = gmdate('Y-m-d');
$failures = 0;

foreach (['pc', 'console'] as $platform) {
    foreach (['europe', 'americas', 'asia'] as $region) {
        $query = http_build_query([
            'platform' => $platform,
            'gamemode' => 'competitive',
            'region' => $region,
        ]);
        [$status, $body] = ow_http('GET', OW_OVERFAST_URL . '/heroes/stats?' . $query, [], null, 30);
        $rows = $status === 200 ? json_decode($body, true) : null;

        if (!is_array($rows) || count($rows) === 0) {
            fwrite(STDERR, "Skipped {$platform}/{$region}: status {$status}\n");
            $failures++;
            continue;
        }

        $key = "ow:stats:{$platform}:{$region}:{$date}";
        ow_upstash(['SET', $key, $body, 'EX', SNAPSHOT_TTL_SECONDS]);
        echo "Saved {$key} (" . count($rows) . " heroes)\n";
        sleep(1);
    }
}

$cutoff = time() - CACHE_MAX_AGE_SECONDS;
foreach (glob(OW_CACHE_DIR . '/*/*') ?: [] as $file) {
    if (is_file($file) && filemtime($file) < $cutoff) {
        unlink($file);
    }
}

exit($failures === 0 ? 0 : 1);
