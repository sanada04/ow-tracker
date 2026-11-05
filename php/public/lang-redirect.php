<?php

declare(strict_types=1);

// Sends paths without a language prefix to the visitor's language.
// Mirrors detectLocale() in lib/i18n/index.ts.

const LOCALES = ['ja', 'en', 'ko'];
const FALLBACK_LOCALE = 'en';

function detect_locale(string $acceptLanguage): string
{
    $preferences = [];
    foreach (explode(',', $acceptLanguage) as $part) {
        $pieces = explode(';q=', trim($part));
        $preferences[] = [
            'primary' => explode('-', strtolower(trim($pieces[0])))[0],
            'q' => isset($pieces[1]) && is_numeric($pieces[1]) ? (float) $pieces[1] : 1.0,
        ];
    }
    usort($preferences, static fn (array $a, array $b): int => $b['q'] <=> $a['q']);

    foreach ($preferences as $preference) {
        if (in_array($preference['primary'], LOCALES, true)) {
            return $preference['primary'];
        }
    }
    return FALLBACK_LOCALE;
}

$locale = detect_locale((string) ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''));
$path = rtrim((string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH), '/');
$query = (string) ($_SERVER['QUERY_STRING'] ?? '');

header('Vary: Accept-Language');
header('Location: /' . $locale . $path . ($query !== '' ? '?' . $query : ''), true, 302);
