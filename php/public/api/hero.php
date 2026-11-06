<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/ow-php/lib.php';

ow_require_method('GET');
ow_rate_limit('hero', 120, 60);

try {
    $key = (string) ($_GET['key'] ?? '');
    if (!in_array($key, ow_hero_keys(), true)) {
        ow_json(['error' => 'Unknown hero'], 404);
    }
} catch (RuntimeException) {
    ow_json(['error' => 'Hero data is unavailable'], 503);
}

$locales = ['ja' => '?locale=ja-jp', 'ko' => '?locale=ko-kr'];
$locale = $locales[$_GET['lang'] ?? ''] ?? '';
[$status, $body] = ow_overfast('/heroes/' . rawurlencode($key) . $locale, 86400);
ow_raw_json($body !== '' ? $body : '{"error":"Upstream error"}', $status);
