<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/ow-php/lib.php';

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const SPAM_PATTERNS = ['/ozon\.ru/i', '/share\.google/i', '/t\.me\//i', '/bit\.ly\//i'];

function field(string $name): string
{
    return trim((string) ($_POST[$name] ?? ''));
}

function looks_like_spam(string $name, string $message): bool
{
    $combined = $name . ' ' . $message;
    if (preg_match('/[\x{0400}-\x{04FF}]/u', $combined) === 1) {
        return true;
    }
    if (preg_match_all('/https?:\/\//i', $message) >= 2) {
        return true;
    }
    foreach (SPAM_PATTERNS as $pattern) {
        if (preg_match($pattern, $combined) === 1) {
            return true;
        }
    }
    return false;
}

function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

ow_require_method('POST');
ow_require_same_origin();
ow_rate_limit('contact', 5, 3600);

// Bots fill the hidden field and get a success response, so they learn nothing.
if (field('website') !== '') {
    ow_json(['status' => 'success']);
}

$topic = str_replace(["\r", "\n"], ' ', field('topic'));
$name = field('name');
$message = field('message');
$replyTo = filter_var(field('senderEmail'), FILTER_VALIDATE_EMAIL) ?: null;

if ($name === '' || $message === '') {
    ow_json(['status' => 'error', 'message' => 'Name and message are required.'], 400);
}
if (mb_strlen($name) > MAX_NAME_LENGTH || mb_strlen($message) > MAX_MESSAGE_LENGTH) {
    ow_json(['status' => 'error', 'message' => 'Message is too long.'], 400);
}
if (looks_like_spam($name, $message)) {
    ow_json(['status' => 'success']);
}

$config = ow_config();
$text = "From: {$name}\n" . ($replyTo !== null ? "Reply-to: {$replyTo}\n" : '') . "\n{$message}";
$html = '<p><strong>From:</strong> ' . escape_html($name) . '</p>'
    . ($replyTo !== null ? '<p><strong>Reply-to:</strong> ' . escape_html($replyTo) . '</p>' : '')
    . '<p><strong>Topic:</strong> ' . escape_html($topic) . '</p><hr />'
    . '<p style="white-space:pre-wrap">' . escape_html($message) . '</p>';

$payload = [
    'from' => $config['contact_from'],
    'to' => $config['contact_to'],
    'subject' => "[OW Tracker] {$topic}",
    'text' => $text,
    'html' => $html,
];
if ($replyTo !== null) {
    $payload['reply_to'] = $replyTo;
}

[$status] = ow_http(
    'POST',
    'https://api.resend.com/emails',
    ['Authorization: Bearer ' . $config['resend_api_key'], 'Content-Type: application/json'],
    (string) json_encode($payload)
);

if ($status < 200 || $status >= 300) {
    ow_json(['status' => 'error', 'message' => 'Failed to send the message.'], 502);
}
ow_json(['status' => 'success']);
