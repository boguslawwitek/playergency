import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  pl: () => import('./dictionaries/pl.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default)
}

export const getDictionary = async (locale: Locale) => {
  return locale == 'pl' ? dictionaries.pl() : dictionaries.en();
};