<?php

declare(strict_types=1);

// Serves the prebuilt player page with player-specific metadata, so search
// engines and social previews see the real name instead of a generic title.

require dirname(__DIR__) . '/ow-php/lib.php';

const SITE_URL = 'https://owtracker.org';

function escape_attr(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function battle_tag(string $playerId): ?string
{
    return preg_match('/^(.+)-(\d+)$/', $playerId, $matches) === 1 && !str_contains($playerId, '|')
        ? $matches[1] . '#' . $matches[2]
        : null;
}

function player_meta(string $lang, string $id, ?array $summary): string
{
    $tag = battle_tag($id);
    $username = (string) ($summary['username'] ?? '');
    $name = $username !== '' ? $username : ($tag ?? $id);
    $display = $username !== '' && $tag !== null ? "{$username} ({$tag})" : $name;
    $description = $lang === 'en'
        ? "View {$display}'s Overwatch stats: competitive rank, winrate, KDA, and hero statistics."
        : "{$display} の Overwatch 戦績: コンペティティブランク・勝率・KDA・ヒーロー別スタッツを確認。";
    $title = "{$display} — Overwatch Stats | OW Tracker";
    $canonical = SITE_URL . "/{$lang}/players/" . rawurlencode($id);

    $tags = [
        '<title>' . escape_attr($title) . '</title>',
        '<meta name="description" content="' . escape_attr($description) . '"/>',
        '<link rel="canonical" href="' . escape_attr($canonical) . '"/>',
        '<meta property="og:title" content="' . escape_attr($title) . '"/>',
        '<meta property="og:description" content="' . escape_attr($description) . '"/>',
    ];
    if ($summary === null) {
        $tags[] = '<meta name="robots" content="noindex"/>';
    }
    if (is_string($summary['avatar'] ?? null)) {
        $tags[] = '<meta property="og:image" content="' . escape_attr($summary['avatar']) . '"/>';
    }
    return implode('', $tags);
}

$lang = (string) ($_GET['lang'] ?? '');
$id = trim((string) ($_GET['id'] ?? ''));
$shell = __DIR__ . "/{$lang}/players/_.html";

if (!in_array($lang, ['ja', 'en', 'ko'], true) || $id === '' || mb_strlen($id) > 128 || !is_file($shell)) {
    http_response_code(404);
    readfile(__DIR__ . '/404.html');
    exit;
}

ow_rate_limit('player-page', 120, 60);
[$status, $body] = ow_overfast('/players/' . rawurlencode($id) . '/summary', 300);
$summary = $status === 200 ? json_decode($body, true) : null;

$html = (string) file_get_contents($shell);
$html = (string) preg_replace('/<title>.*?<\/title>/s', '', $html, 1);
$html = (string) preg_replace('/<meta name="description"[^>]*>/', '', $html, 1);
$html = (string) preg_replace('/<meta property="og:(title|description|image)[^>]*>/', '', $html);

header('Content-Type: text/html; charset=utf-8');
echo str_replace('</head>', player_meta($lang, $id, is_array($summary) ? $summary : null) . '</head>', $html);
