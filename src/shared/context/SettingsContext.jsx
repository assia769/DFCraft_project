import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  notifications: true,
  language: 'fr',
  font: 'concert',
  fontSize: 'medium',
  primaryColor: 'purple',
  darkMode: false,
};

// ⚠️ The purple theme MUST exactly match the hardcoded values in tailwind.config.js.
// Since purple uses no data-theme override, Tailwind's values are what actually render.
// The other themes override Tailwind via [data-theme] scoped CSS, so their values
// are authoritative — keep them consistent with whatever you want to display.
const COLOR_THEMES = {
  purple: {
    // Matches tailwind.config.js exactly
    lightElements:    '#7C3AED',
    lightPoints:      '#C282FF',
    lightList:        '#5B1FC0',
    lightBar:         '#5B1FC0',
    lightProgressBar: '#6D00D8',
    lightSelectedBar: '#B46CFA',
    lightPlaceHolder: '#9D72C7',
    darkElements:     '#A855F7',
    darkPoints:       '#5A00B0',
    darkList:         '#C8A0EF',
    darkBar:          '#C8A0EF',
    darkProgressBar:  '#B46CFA',
    darkSelectedBar:  '#5A00B0',
    darkPlaceHolder:  '#9D72C7',
  },
  blue: {
    lightElements:    '#3B82F6',
    lightPoints:      '#93C5FD',
    lightList:        '#DBEAFE',
    lightBar:         '#60A5FA',
    lightProgressBar: '#2563EB',
    lightSelectedBar: '#BFDBFE',
    lightPlaceHolder: '#7DB3F5',
    darkElements:     '#60A5FA',
    darkPoints:       '#3B82F6',
    darkList:         '#1E3A8A',
    darkBar:          '#1D4ED8',
    darkProgressBar:  '#3B82F6',
    darkSelectedBar:  '#1E40AF',
    darkPlaceHolder:  '#7DB3F5',
  },
  green: {
    lightElements:    '#10B981',
    lightPoints:      '#6EE7B7',
    lightList:        '#D1FAE5',
    lightBar:         '#34D399',
    lightProgressBar: '#059669',
    lightSelectedBar: '#A7F3D0',
    lightPlaceHolder: '#6BDBB0',
    darkElements:     '#34D399',
    darkPoints:       '#10B981',
    darkList:         '#064E3B',
    darkBar:          '#047857',
    darkProgressBar:  '#10B981',
    darkSelectedBar:  '#065F46',
    darkPlaceHolder:  '#6BDBB0',
  },
  red: {
    lightElements:    '#EF4444',
    lightPoints:      '#FCA5A5',
    lightList:        '#FEE2E2',
    lightBar:         '#F87171',
    lightProgressBar: '#DC2626',
    lightSelectedBar: '#FECACA',
    lightPlaceHolder: '#F5A3A3',
    darkElements:     '#F87171',
    darkPoints:       '#EF4444',
    darkList:         '#7F1D1D',
    darkBar:          '#B91C1C',
    darkProgressBar:  '#EF4444',
    darkSelectedBar:  '#991B1B',
    darkPlaceHolder:  '#F5A3A3',
  },
  orange: {
    lightElements:    '#F97316',
    lightPoints:      '#FDBA74',
    lightList:        '#FFEDD5',
    lightBar:         '#FB923C',
    lightProgressBar: '#EA580C',
    lightSelectedBar: '#FED7AA',
    lightPlaceHolder: '#FDB180',
    darkElements:     '#FB923C',
    darkPoints:       '#F97316',
    darkList:         '#7C2D12',
    darkBar:          '#C2410C',
    darkProgressBar:  '#F97316',
    darkSelectedBar:  '#9A3412',
    darkPlaceHolder:  '#FDB180',
  },
};

const TOKEN_CLASS_MAP = {
  lightElements:    [
    { cls: '.text-lightElements',   prop: 'color' },
    { cls: '.bg-lightElements',     prop: 'background-color' },
    { cls: '.border-lightElements', prop: 'border-color' },
    { cls: '.stroke-lightElements', prop: 'stroke' },
    { cls: '.fill-lightElements',   prop: 'fill' },
  ],
  lightPoints: [
    { cls: '.text-lightPoints', prop: 'color' },
    { cls: '.bg-lightPoints',   prop: 'background-color' },
  ],
  lightList: [
    { cls: '.bg-lightList',   prop: 'background-color' },
    { cls: '.text-lightList', prop: 'color' },
  ],
  lightBar:         [{ cls: '.bg-lightBar',         prop: 'background-color' }],
  lightProgressBar: [{ cls: '.bg-lightProgressBar', prop: 'background-color' }],
  lightSelectedBar: [{ cls: '.bg-lightSelectedBar', prop: 'background-color' }],
  lightPlaceHolder: [
    { cls: '.text-lightPlaceHolder',   prop: 'color' },
    { cls: '.border-lightPlaceHolder', prop: 'border-color' },
  ],
  darkElements: [
    { cls: '.dark .text-darkElements',   prop: 'color' },
    { cls: '.dark .bg-darkElements',     prop: 'background-color' },
    { cls: '.dark .border-darkElements', prop: 'border-color' },
    { cls: '.dark .stroke-darkElements', prop: 'stroke' },
    { cls: '.dark .fill-darkElements',   prop: 'fill' },
  ],
  darkPoints: [
    { cls: '.dark .text-darkPoints', prop: 'color' },
    { cls: '.dark .bg-darkPoints',   prop: 'background-color' },
  ],
  darkList: [
    { cls: '.dark .bg-darkList',   prop: 'background-color' },
    { cls: '.dark .text-darkList', prop: 'color' },
  ],
  darkBar:         [{ cls: '.dark .bg-darkBar',         prop: 'background-color' }],
  darkProgressBar: [{ cls: '.dark .bg-darkProgressBar', prop: 'background-color' }],
  darkSelectedBar: [{ cls: '.dark .bg-darkSelectedBar', prop: 'background-color' }],
  darkPlaceHolder: [
    { cls: '.dark .text-darkPlaceHolder',   prop: 'color' },
    { cls: '.dark .border-darkPlaceHolder', prop: 'border-color' },
  ],
};

function buildThemeCSS(themeName, theme) {
  if (themeName === 'purple') return '';

  const attr = `[data-theme="${themeName}"]`;
  const lines = [];

  Object.entries(TOKEN_CLASS_MAP).forEach(([token, mappings]) => {
    const value = theme[token];
    if (!value) return;

    mappings.forEach(({ cls, prop }) => {
      if (cls.startsWith('.dark ')) {
        lines.push(`${attr}.dark ${cls.slice(6)} { ${prop}: ${value} !important; }`);
      } else {
        lines.push(`${attr} ${cls} { ${prop}: ${value} !important; }`);
      }
    });

    if (token === 'lightPlaceHolder') {
      lines.push(
        `${attr} .placeholder\\:text-lightPlaceHolder::placeholder { color: ${value} !important; }`
      );
    }
    if (token === 'darkPlaceHolder') {
      lines.push(
        `${attr}.dark .placeholder\\:text-darkPlaceHolder::placeholder { color: ${value} !important; }`
      );
    }
  });

  return lines.join('\n');
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['settings'], (result) => {
            if (result.settings) {
              setSettings({ ...DEFAULT_SETTINGS, ...result.settings });
            }
            setIsLoading(false);
          });
        } else {
          const saved = localStorage.getItem('dfcraft_settings');
          if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ settings: updated });
      } else {
        localStorage.setItem('dfcraft_settings', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const updateSetting = (key, value) => saveSettings({ [key]: value });
  const resetSettings = () => saveSettings(DEFAULT_SETTINGS);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = sizes[settings.fontSize] ?? sizes.medium;
  }, [settings.fontSize]);

  useEffect(() => {
    const families = {
      concert: "'Concert One', cursive",
      arial:   "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      times:   "'Times New Roman', Times, Georgia, serif",
      courier: "'Courier New', Courier, 'Lucida Console', monospace",
    };
    const family = families[settings.font] ?? families.concert;
    document.documentElement.style.fontFamily = family;
    document.body.style.fontFamily = family;

    let styleEl = document.getElementById('dynamic-font-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-font-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `* { font-family: ${family} !important; }`;
  }, [settings.font]);

  useEffect(() => {
    const themeName = settings.primaryColor;
    const theme     = COLOR_THEMES[themeName] ?? COLOR_THEMES.purple;
    const root      = document.documentElement;

    if (themeName === 'purple') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', themeName);
    }

    let styleEl = document.getElementById('dynamic-color-theme');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-color-theme';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = buildThemeCSS(themeName, theme);
  }, [settings.primaryColor]);

  useEffect(() => {
    document.documentElement.dir  = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const value = { settings, updateSetting, saveSettings, resetSettings, isLoading };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}