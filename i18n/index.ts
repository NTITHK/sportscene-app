import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { en, zhHans, zhHant } from './translations';

export type Locale = 'zh-Hant' | 'zh-Hans' | 'en';

// Create an instance (new API)
export const i18n = new I18n({
  en,
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
});

// Enable fallbacks (new API uses enableFallback)
i18n.enableFallback = true;

export function setLocale(locale: Locale) {
  i18n.locale = locale;
}

export function detectInitialLocale(defaultLocale: Locale = 'zh-Hant'): Locale {
  const sys = (Localization.locale || '').toLowerCase();
  if (sys.startsWith('zh-hant') || sys.startsWith('zh-tw') || sys.startsWith('zh-hk')) return 'zh-Hant';
  if (sys.startsWith('zh-hans') || sys.startsWith('zh-cn') || sys.startsWith('zh-sg')) return 'zh-Hans';
  if (sys.startsWith('en')) return 'en';
  return defaultLocale;
}

export const t = (key: string, options?: any) => i18n.t(key, options);
