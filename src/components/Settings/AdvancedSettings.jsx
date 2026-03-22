import { Download, Trash2, Database } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useState } from 'react';
import { useTranslation } from '../../shared/i18n/translations';

export default function AdvancedSettings() {
  const { settings } = useSettings();
  const { t } = useTranslation("settings");
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dfcraft-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(t('settingsSaved'));
  };

  const clearCache = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.clear(() => {
        showNotification('Cache effacé !');
        setTimeout(() => window.location.reload(), 1000);
      });
    } else {
      localStorage.clear();
      showNotification('Cache effacé !');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-light dark:text-dark mb-6">
        {t('advancedSettings')}
      </h2>

      {/* Export Settings */}
      <div className="p-4 bg-lightElements dark:bg-darkElements rounded-xl border-2 border-light dark:border-dark">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-light dark:text-dark mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-light dark:text-dark mb-1">
              {t('exportSettings')}
            </h3>
            <p className="text-sm text-light dark:text-dark mb-3">
              {t('exportDesc')}
            </p>
            <button
              onClick={exportSettings}
              className="px-4 py-2 bg-lightElements dark:bg-darkElements text-light dark:text-dark rounded-lg hover:opacity-90 transition-opacity border border-light dark:border-dark"
            >
              {t('exportButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cache */}
      <div className="p-4 bg-lightElements dark:bg-darkElements rounded-xl border-2 border-light dark:border-dark">
        <div className="flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-light dark:text-dark mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-light dark:text-dark mb-1">
              {t('clearCache')}
            </h3>
            <p className="text-sm text-light dark:text-dark mb-3">
              {t('clearCacheDesc')}
            </p>
            <button
              onClick={clearCache}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              {t('clearButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="p-4 bg-lightElements dark:bg-darkElements rounded-xl border-2 border-light dark:border-dark">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-lightElements dark:text-dark mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-lightElements dark:text-dark mb-1">
              {t('storageInfo')}
            </h3>
            <p className="text-sm text-light dark:text-dark">
              {t('storageInfoDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-lightElements dark:bg-darkElements text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {notification}
        </div>
      )}
    </div>
  );
}