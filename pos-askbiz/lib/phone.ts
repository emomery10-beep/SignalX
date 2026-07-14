// Minimal phone-entry helpers for the POS staff login (phone is the default
// method — low-literacy cashiers find a country-code + number easier than
// typing an email). Mirrors the root app's lib/geo/index.ts subset so both
// apps normalise to the same E.164 format against the shared pos_staff table.

export const COUNTRY_DIAL: { code: string; dial: string; flag: string }[] = [
  { code: 'KE', dial: '+254', flag: '🇰🇪' },
  { code: 'NG', dial: '+234', flag: '🇳🇬' },
  { code: 'UG', dial: '+256', flag: '🇺🇬' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿' },
  { code: 'GH', dial: '+233', flag: '🇬🇭' },
  { code: 'ZA', dial: '+27',  flag: '🇿🇦' },
  { code: 'RW', dial: '+250', flag: '🇷🇼' },
  { code: 'ZM', dial: '+260', flag: '🇿🇲' },
  { code: 'ET', dial: '+251', flag: '🇪🇹' },
  { code: 'SO', dial: '+252', flag: '🇸🇴' },
  { code: 'DJ', dial: '+253', flag: '🇩🇯' },
  { code: 'ZW', dial: '+263', flag: '🇿🇼' },
  { code: 'MW', dial: '+265', flag: '🇲🇼' },
  { code: 'MZ', dial: '+258', flag: '🇲🇿' },
  { code: 'US', dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧' },
  { code: 'IE', dial: '+353', flag: '🇮🇪' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸' },
  { code: 'IT', dial: '+39',  flag: '🇮🇹' },
  { code: 'NL', dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', dial: '+32',  flag: '🇧🇪' },
  { code: 'PT', dial: '+351', flag: '🇵🇹' },
  { code: 'AT', dial: '+43',  flag: '🇦🇹' },
  { code: 'FI', dial: '+358', flag: '🇫🇮' },
  { code: 'AE', dial: '+971', flag: '🇦🇪' },
  { code: 'IN', dial: '+91',  flag: '🇮🇳' },
  { code: 'SG', dial: '+65',  flag: '🇸🇬' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺' },
  { code: 'MX', dial: '+52',  flag: '🇲🇽' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷' },
]

// Normalise user input to E.164. Accepts local formats with a leading 0
// (e.g. Kenyan 0712…), international 00-prefix, or already-+prefixed.
// Returns null when the result isn't a plausible E.164 number.
export function toE164(dial: string, raw: string): string | null {
  let n = raw.replace(/[\s\-().]/g, '')
  if (n.startsWith('00')) n = '+' + n.slice(2)
  if (!n.startsWith('+')) n = dial + n.replace(/^0+/, '')
  return /^\+[1-9]\d{6,14}$/.test(n) ? n : null
}
