#!/usr/bin/env node
// Turns vercel.json crons into a server crontab (Vercel Cron does not exist off Vercel).
// Usage: node scripts/gen-crontab.mjs <vercel.json path> <https://base-url>  > crontab.txt
// Install on the server:  crontab crontab.txt   (needs CRON_SECRET exported in that crontab's env)
import { readFileSync } from 'node:fs'
const [file = 'vercel.json', base = 'https://askbiz.co'] = process.argv.slice(2)
const crons = JSON.parse(readFileSync(file, 'utf8')).crons || []
console.log('# generated from ' + file + ' — times are UTC, same as Vercel')
console.log('SHELL=/bin/bash\nCRON_TZ=UTC\nCRON_SECRET=REPLACE_ME')
for (const c of crons) {
  console.log(`${c.schedule} curl -fsS -m 300 -H "Authorization: Bearer $CRON_SECRET" "${base}${c.path}" >/dev/null || echo "cron failed: ${c.path}" >&2`)
}
