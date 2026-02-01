import { useState } from 'react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useTranslation } from '../../shared/i18n/translations';
import GeneralSettings from '../../components/Settings/GeneralSettings';
import AppearanceSettings from '../../components/Settings/AppearanceSettings';
import AdvancedSettings from '../../components/Settings/AdvancedSettings';
import { Settings, Palette, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const { settings, resetSettings } = useSettings();
  const { t } = useTranslation(settings.language);
  const [activeTab, setActiveTab] = useState('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs = [
    { id: 'general', label: t('generalSettings'), icon: Settings },
    { id: 'appearance', label: t('appearanceSettings'), icon: Palette },
    { id: 'advanced', label: t('advancedSettings'), icon: Sliders },
  ];

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
  };

  return (
    <div className="bg-light dark:bg-dark min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-lightElements dark:text-darkElements mb-2">
            {t('settingsTitle')}
          </h1>
          <p className="text-lightPlaceHolder dark:text-darkPlaceHolder">
            Personnalisez votre expérience DFCraft
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-lightList dark:bg-darkList rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-lightElements dark:bg-darkElements text-white shadow-lg'
                        : 'text-lightElements dark:text-darkElements hover:bg-light dark:hover:bg-dark'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full mt-4 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg"
            >
              {t('reset')}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-lightList dark:bg-darkList rounded-2xl p-6 shadow-lg">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'appearance' && <AppearanceSettings />}
              {activeTab === 'advanced' && <AdvancedSettings />}
            </div>
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-light dark:bg-dark rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-lightElements dark:text-darkElements mb-4">
                {t('confirmReset')}
              </h2>
              <p className="text-lightPlaceHolder dark:text-darkPlaceHolder mb-6">
                {t('resetWarning')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-3 bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements rounded-xl font-medium hover:bg-opacity-80 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg"
                >
                  {t('confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}