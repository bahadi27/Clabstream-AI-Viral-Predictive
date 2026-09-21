export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  regionCode?: string;
  popular?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "auto", name: "Auto-Detect", nativeName: "Auto Match Audio", flag: "🌐", popular: true },
  { code: "en", name: "English", nativeName: "English (US / Global)", flag: "🇺🇸", popular: true },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", popular: true },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", popular: true },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", popular: true },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", popular: true },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", popular: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", popular: false },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", popular: false },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文 (普通话)", flag: "🇨🇳", popular: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", popular: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", popular: false },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", popular: false },
];

export function getLanguageByCode(code?: string): LanguageOption {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const normalized = code.toLowerCase().trim();
  const match = SUPPORTED_LANGUAGES.find(
    (l) =>
      l.code.toLowerCase() === normalized ||
      l.name.toLowerCase().includes(normalized) ||
      l.nativeName.toLowerCase().includes(normalized)
  );
  return match || { code, name: code, nativeName: code, flag: "🌐" };
}

export function getLanguageDisplayName(code?: string): string {
  const lang = getLanguageByCode(code);
  return lang.code === "auto" ? "Auto-Detect" : `${lang.name} (${lang.nativeName})`;
}
