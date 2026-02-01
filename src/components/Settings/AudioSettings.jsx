import { Volume2, Music } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useTranslation } from '../../shared/i18n/translations';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import VolumeSlider from './VolumeSlider';

export default function AudioSettings() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation(settings.language);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lightElements dark:text-darkElements mb-6">
        {t('audioSettings')}
      </h2>

      {/* Volume Control */}
      <SettingItem
        icon={Volume2}
        title={t('volume')}
        description={t('volumeDesc')}
      >
        <VolumeSlider
          value={settings.volume}
          onChange={(value) => updateSetting('volume', value)}
        />
      </SettingItem>

      {/* Sounds Toggle */}
      <SettingItem
        icon={Music}
        title={t('sounds')}
        description={t('soundsDesc')}
      >
        <ToggleSwitch
          checked={settings.sounds}
          onChange={(checked) => updateSetting('sounds', checked)}
        />
      </SettingItem>

      {/* Volume Preview */}
      <div className="mt-6 p-4 bg-light dark:bg-dark rounded-xl">
        <p className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder mb-2">
          Volume actuel : {settings.volume}%
        </p>
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-lightElements dark:text-darkElements" />
          <div className="flex-1 h-2 bg-lightList dark:bg-darkList rounded-full overflow-hidden">
            <div
              className="h-full bg-lightElements dark:bg-darkElements transition-all"
              style={{ width: `${settings.volume}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}