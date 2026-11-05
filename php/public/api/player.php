<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/ow-php/lib.php';

ow_require_method('GET');
ow_rate_limit('player', 60, 60);

$id = trim((string) ($_GET['id'] ?? ''));
if ($id === '' || mb_strlen($id) > 128) {
    ow_json(['error' => 'Invalid player id'], 400);
}

$gamemode = (string) ($_GET['gamemode'] ?? '');
if ($gamemode !== '' && !in_array($gamemode, ['quickplay', 'competitive'], true)) {
    ow_json(['error' => 'Invalid gamemode'], 400);
}

$base = '/players/' . rawurlencode($id);
[$summaryStatus, $summaryBody] = ow_overfast($base . '/summary', 300);
if ($summaryStatus !== 200) {
    ow_json(['error' => 'Player not found'], $summaryStatus === 404 ? 404 : 502);
}

$query = $gamemode !== '' ? '?gamemode=' . $gamemode : '';
[$statsStatus, $statsBody] = ow_overfast($base . '/stats/summary' . $query, 300);

ow_json([
    'summary' => json_decode($summaryBody, true),
    'stats' => $statsStatus === 200 ? json_decode($statsBody, true) : null,
]);
