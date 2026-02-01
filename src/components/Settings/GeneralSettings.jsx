import { Bell, Globe } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useTranslation } from '../../shared/i18n/translations';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';

export default function GeneralSettings() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation(settings.language);

  const languageOptions = [
    { value: 'fr', label: t('french'), flag: '🇫🇷' },
    { value: 'en', label: t('english'), flag: '🇬🇧' },
    { value: 'ar', label: t('arabic'), flag: '🇸🇦' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lightElements dark:text-darkElements mb-6">
        {t('generalSettings')}
      </h2>

      {/* Notifications */}
      <SettingItem
        icon={Bell}
        title={t('notifications')}
        description={t('notificationsDesc')}
      >
        <ToggleSwitch
          checked={settings.notifications}
          onChange={(checked) => updateSetting('notifications', checked)}
        />
      </SettingItem>

      {/* Language (GLOBAL) */}
      <SettingItem
        icon={Globe}
        title={t('language')}
        description={t('languageDesc')}
      >
        <SelectInput
          value={settings.language}
          onChange={(value) => updateSetting('language', value)}
          options={languageOptions}
        />
      </SettingItem>
    </div>
  );
}