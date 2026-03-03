import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// Paramètres par défaut
const DEFAULT_SETTINGS = {
  // Notifications
  notifications: true,
  
  // Langue (GLOBALE - pour toute l'extension)
  language: 'fr', // 'fr', 'en', 'ar'
  
  // Police
  font: 'concert', // 'concert', 'arial', 'times', 'courier'
  
  // Taille de police
  fontSize: 'medium', // 'small', 'medium', 'large', 'xlarge'
  
  // Couleur principale (thème)
  primaryColor: 'purple', // 'purple', 'blue', 'green', 'red', 'orange'
  
  // Mode sombre
  darkMode: false,
};

// Configuration des couleurs par thème (Light ET Dark)
const COLOR_THEMES = {
  purple: {
    // Mode clair
    lightElements: '#7C3AED',
    lightPoints: '#C282FF',
    lightList: '#E9D5FF',
    lightBar: '#A78BFA',
    lightProgressBar: '#8B5CF6',
    lightSelectedBar: '#C4B5FD',
    lightPlaceHolder: '#9D72C7',
    // Mode sombre
    darkElements: '#A855F7',
    darkPoints: '#7C3AED',
    darkList: '#4C1D95',
    darkBar: '#6D28D9',
    darkProgressBar: '#7C3AED',
    darkSelectedBar: '#5B21B6',
    darkPlaceHolder: '#9D72C7',
  },
  blue: {
    // Mode clair
    lightElements: '#3B82F6',
    lightPoints: '#93C5FD',
    lightList: '#DBEAFE',
    lightBar: '#60A5FA',
    lightProgressBar: '#2563EB',
    lightSelectedBar: '#BFDBFE',
    lightPlaceHolder: '#7DB3F5',
    // Mode sombre
    darkElements: '#60A5FA',
    darkPoints: '#3B82F6',
    darkList: '#1E3A8A',
    darkBar: '#1D4ED8',
    darkProgressBar: '#3B82F6',
    darkSelectedBar: '#1E40AF',
    darkPlaceHolder: '#7DB3F5',
  },
  green: {
    // Mode clair
    lightElements: '#10B981',
    lightPoints: '#6EE7B7',
    lightList: '#D1FAE5',
    lightBar: '#34D399',
    lightProgressBar: '#059669',
    lightSelectedBar: '#A7F3D0',
    lightPlaceHolder: '#6BDBB0',
    // Mode sombre
    darkElements: '#34D399',
    darkPoints: '#10B981',
    darkList: '#064E3B',
    darkBar: '#047857',
    darkProgressBar: '#10B981',
    darkSelectedBar: '#065F46',
    darkPlaceHolder: '#6BDBB0',
  },
  red: {
    // Mode clair
    lightElements: '#EF4444',
    lightPoints: '#FCA5A5',
    lightList: '#FEE2E2',
    lightBar: '#F87171',
    lightProgressBar: '#DC2626',
    lightSelectedBar: '#FECACA',
    lightPlaceHolder: '#F5A3A3',
    // Mode sombre
    darkElements: '#F87171',
    darkPoints: '#EF4444',
    darkList: '#7F1D1D',
    darkBar: '#B91C1C',
    darkProgressBar: '#EF4444',
    darkSelectedBar: '#991B1B',
    darkPlaceHolder: '#F5A3A3',
  },
  orange: {
    // Mode clair
    lightElements: '#F97316',
    lightPoints: '#FDBA74',
    lightList: '#FFEDD5',
    lightBar: '#FB923C',
    lightProgressBar: '#EA580C',
    lightSelectedBar: '#FED7AA',
    lightPlaceHolder: '#FDB180',
    // Mode sombre
    darkElements: '#FB923C',
    darkPoints: '#F97316',
    darkList: '#7C2D12',
    darkBar: '#C2410C',
    darkProgressBar: '#F97316',
    darkSelectedBar: '#9A3412',
    darkPlaceHolder: '#FDB180',
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres depuis chrome.storage
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
          // Fallback vers localStorage pour le développement
          const savedSettings = localStorage.getItem('dfcraft_settings');
          if (savedSettings) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ settings: updatedSettings });
      } else {
        localStorage.setItem('dfcraft_settings', JSON.stringify(updatedSettings));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Mettre à jour un paramètre spécifique
  const updateSetting = (key, value) => {
    saveSettings({ [key]: value });
  };

  // Réinitialiser les paramètres
  const resetSettings = () => {
    saveSettings(DEFAULT_SETTINGS);
  };

  // Appliquer le mode sombre
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Appliquer la taille de police
  useEffect(() => {
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
    };
    document.documentElement.style.fontSize = fontSizes[settings.fontSize] || fontSizes.medium;
  }, [settings.fontSize]);

  // Appliquer la police - AVEC FALLBACK SYSTÈME
  useEffect(() => {
    const fontFamilies = {
      concert: "'Concert One', cursive",
      arial: "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      times: "'Times New Roman', Times, Georgia, serif",
      courier: "'Courier New', Courier, 'Lucida Console', monospace",
    };
    
    const selectedFont = fontFamilies[settings.font] || fontFamilies.concert;
    
    // Appliquer à tout le document
    document.documentElement.style.fontFamily = selectedFont;
    document.body.style.fontFamily = selectedFont;
    
    // Forcer l'application sur tous les éléments
    const style = document.createElement('style');
    style.id = 'dynamic-font-style';
    style.textContent = `
      * {
        font-family: ${selectedFont} !important;
      }
    `;
    
    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('dynamic-font-style');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    document.head.appendChild(style);
  }, [settings.font]);

  // Appliquer le thème de couleur (MODE CLAIR ET SOMBRE)
  useEffect(() => {
    const theme = COLOR_THEMES[settings.primaryColor] || COLOR_THEMES.purple;
    
    // Créer une feuille de style dynamique
    const styleId = 'dynamic-color-theme';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Générer le CSS pour mode clair et sombre
    styleElement.textContent = `
      /* MODE CLAIR */
      .text-lightElements { color: ${theme.lightElements} !important; }
      .bg-lightElements { background-color: ${theme.lightElements} !important; }
      .text-lightPoints { color: ${theme.lightPoints} !important; }
      .bg-lightPoints { background-color: ${theme.lightPoints} !important; }
      .bg-lightList { background-color: ${theme.lightList} !important; }
      .bg-lightBar { background-color: ${theme.lightBar} !important; }
      .bg-lightProgressBar { background-color: ${theme.lightProgressBar} !important; }
      .bg-lightSelectedBar { background-color: ${theme.lightSelectedBar} !important; }
      .text-lightPlaceHolder { color: ${theme.lightPlaceHolder} !important; }
      .border-lightPlaceHolder { border-color: ${theme.lightPlaceHolder} !important; }
      .placeholder\\:text-lightPlaceHolder::placeholder { color: ${theme.lightPlaceHolder} !important; }
      
      /* MODE SOMBRE */
      .dark .text-darkElements { color: ${theme.darkElements} !important; }
      .dark .bg-darkElements { background-color: ${theme.darkElements} !important; }
      .dark .text-darkPoints { color: ${theme.darkPoints} !important; }
      .dark .bg-darkPoints { background-color: ${theme.darkPoints} !important; }
      .dark .bg-darkList { background-color: ${theme.darkList} !important; }
      .dark .bg-darkBar { background-color: ${theme.darkBar} !important; }
      .dark .bg-darkProgressBar { background-color: ${theme.darkProgressBar} !important; }
      .dark .bg-darkSelectedBar { background-color: ${theme.darkSelectedBar} !important; }
      .dark .text-darkPlaceHolder { color: ${theme.darkPlaceHolder} !important; }
      .dark .border-darkPlaceHolder { border-color: ${theme.darkPlaceHolder} !important; }
      .dark .placeholder\\:text-darkPlaceHolder::placeholder { color: ${theme.darkPlaceHolder} !important; }
    `;
  }, [settings.primaryColor]);

  // Appliquer la direction RTL pour l'arabe
  useEffect(() => {
    if (settings.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = settings.language;
    }
  }, [settings.language]);

  const value = {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}