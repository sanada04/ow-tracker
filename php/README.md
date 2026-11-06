# PHP backend

Handles what the static site cannot: player lookup, votes, the contact form,
and the daily stats snapshot.

## Server layout

| Repository | Server | Public |
|---|---|---|
| `out/` (from `npm run build`) | `~/public_html/` | Yes |
| `php/public/` | `~/public_html/` | Yes |
| `php/private/` | `~/ow-php/` | No |
| `php/private/config.example.php` | `~/ow-config/config.php` (copy, then fill in) | No |
| (created at runtime) | `~/ow-cache/` | No |

## Daily snapshot

Run once a day from cron. Plain `php` on this server is 7.4, so use the 8.3
binary:

```bash
/opt/cpanel/ea-php83/root/usr/bin/php ~/ow-php/cron/snapshot.php
```

It saves six competitive combinations (PC and console, three regions) to
Upstash as `ow:stats:{platform}:{region}:{date}`, kept for 400 days.
