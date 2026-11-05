<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/ow-php/lib.php';

ow_require_method('GET');
ow_rate_limit('search', 60, 60);

$name = trim((string) ($_GET['name'] ?? ''));
if (mb_strlen($name) < 2 || mb_strlen($name) > 64) {
    ow_json(['error' => 'Invalid name'], 400);
}

[$status, $body] = ow_overfast('/players?' . http_build_query(['name' => $name]), 60);
ow_raw_json($body !== '' ? $body : '{"error":"Upstream error"}', $status);
