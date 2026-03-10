import { Bell, Globe } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useTranslation } from '../../shared/i18n/translations';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';

export default function GeneralSettings() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation("settings");

  const languageOptions = [
    { value: 'fr', label: t('french')},
    { value: 'en', label: t('english')},
    { value: 'ar', label: t('arabic')},
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-light dark:text-dark mb-6">
        {t('generalSettings')}
      </h2>

      {/* Notifications */}
      {/*10 March 2026: commanting it until i'll add the notification feature */}
      {/* <SettingItem
        icon={Bell}
        title={t('notifications')}
        description={t('notificationsDesc')}
      >
        <ToggleSwitch
          checked={settings.notifications}
          onChange={(checked) => updateSetting('notifications', checked)}
        />
      </SettingItem> */}

      {/* Language (GLOBAL) */}
      <div className='flex flex-col justify-center'>
        <SettingItem
        icon={Globe}
        title={t('language')}
        // description={t('languageDesc')}
      >
        <SelectInput
          value={settings.language}
          onChange={(value) => updateSetting('language', value)}
          options={languageOptions}
        />
      </SettingItem>
      </div>
    </div>
  );
}