<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/ow-php/lib.php';

const TIERS = ['S', 'A', 'B', 'C', 'D'];
const READ_CACHE_SECONDS = 30;

function read_tier_votes(): array
{
    $path = ow_cache_path('votes', 'tier');
    if (is_file($path) && time() - (int) filemtime($path) < READ_CACHE_SECONDS) {
        return json_decode((string) file_get_contents($path), true) ?? [];
    }

    $heroes = ow_hero_keys();
    $results = ow_upstash_pipeline(array_map(
        static fn (string $hero): array => ['HGETALL', "ow:tier:{$hero}"],
        $heroes
    ));

    $votes = [];
    foreach ($heroes as $index => $hero) {
        $counts = ow_hash_to_counts($results[$index] ?? null);
        foreach (TIERS as $tier) {
            $votes[$hero][$tier] = $counts[$tier] ?? 0;
        }
    }
    ow_write_atomic($path, (string) json_encode($votes));
    return $votes;
}

function require_hero(mixed $hero): string
{
    if (!is_string($hero) || !in_array($hero, ow_hero_keys(), true)) {
        ow_json(['error' => 'Unknown hero'], 400);
    }
    return $hero;
}

function write_tier_vote(array $input): void
{
    $hero = require_hero($input['hero'] ?? null);
    $tier = $input['tier'] ?? null;
    $previous = $input['prevTier'] ?? null;
    if (!in_array($tier, TIERS, true) || ($previous !== null && !in_array($previous, TIERS, true))) {
        ow_json(['error' => 'Unknown tier'], 400);
    }

    $key = "ow:tier:{$hero}";
    if (($input['action'] ?? '') === 'remove') {
        ow_upstash(['HINCRBY', $key, $tier, -1]);
    } elseif ($previous !== $tier) {
        $commands = [['HINCRBY', $key, $tier, 1]];
        if ($previous !== null) {
            $commands[] = ['HINCRBY', $key, $previous, -1];
        }
        ow_upstash_pipeline($commands);
    }

    $cachePath = ow_cache_path('votes', 'tier');
    if (is_file($cachePath)) {
        unlink($cachePath);
    }
}

function write_counter_vote(array $input): void
{
    $hero = require_hero($input['hero'] ?? null);
    $counter = require_hero($input['counter'] ?? null);
    $key = "ow:counter:{$hero}";

    if (($input['action'] ?? '') !== 'remove') {
        ow_upstash(['HINCRBY', $key, $counter, 1]);
        return;
    }

    $remaining = (int) ow_upstash(['HGET', $key, $counter]) - 1;
    if ($remaining <= 0) {
        ow_upstash(['HDEL', $key, $counter]);
    } else {
        ow_upstash(['HSET', $key, $counter, $remaining]);
    }
}

$method = ow_require_method('GET', 'POST');

try {
    if ($method === 'GET') {
        ow_rate_limit('votes-read', 120, 60);
        if (($_GET['type'] ?? '') === 'tier') {
            ow_json(['votes' => read_tier_votes()]);
        }
        $hero = require_hero($_GET['hero'] ?? null);
        $votes = ow_hash_to_counts(ow_upstash(['HGETALL', "ow:counter:{$hero}"]));
        ow_json(['votes' => (object) $votes]);
    }

    ow_require_same_origin();
    ow_rate_limit('votes-write', 30, 60);

    $input = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($input)) {
        ow_json(['error' => 'Invalid body'], 400);
    }

    match ($input['type'] ?? '') {
        'tier' => write_tier_vote($input),
        'counter' => write_counter_vote($input),
        default => ow_json(['error' => 'Unknown vote type'], 400),
    };
    ow_json(['success' => true]);
} catch (RuntimeException) {
    ow_json(['error' => 'Vote service is unavailable'], 503);
}
