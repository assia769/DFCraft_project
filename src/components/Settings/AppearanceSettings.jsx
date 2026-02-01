import { Moon, Type, Palette, Maximize2, Sparkles } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useTranslation } from '../../shared/i18n/translations';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';
import ColorPicker from './ColorPicker';

export default function AppearanceSettings() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation(settings.language);

  const fontOptions = [
    { value: 'concert', label: t('fontConcert') },
    { value: 'sans', label: t('fontSans') },
    { value: 'serif', label: t('fontSerif') },
    { value: 'mono', label: t('fontMono') },
  ];

  const fontSizeOptions = [
    { value: 'small', label: t('fontSmall') },
    { value: 'medium', label: t('fontMedium') },
    { value: 'large', label: t('fontLarge') },
    { value: 'xlarge', label: t('fontXLarge') },
  ];

  const colorOptions = [
    { value: 'purple', label: t('colorPurple'), color: '#7C3AED' },
    { value: 'blue', label: t('colorBlue'), color: '#3B82F6' },
    { value: 'green', label: t('colorGreen'), color: '#10B981' },
    { value: 'red', label: t('colorRed'), color: '#EF4444' },
    { value: 'orange', label: t('colorOrange'), color: '#F97316' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lightElements dark:text-darkElements mb-6">
        {t('appearanceSettings')}
      </h2>

      {/* Dark Mode */}
      <SettingItem
        icon={Moon}
        title={t('darkMode')}
        description={t('darkModeDesc')}
      >
        <ToggleSwitch
          checked={settings.darkMode}
          onChange={(checked) => updateSetting('darkMode', checked)}
        />
      </SettingItem>

      {/* Font Family */}
      <SettingItem
        icon={Type}
        title={t('font')}
        description={t('fontDesc')}
      >
        <SelectInput
          value={settings.font}
          onChange={(value) => updateSetting('font', value)}
          options={fontOptions}
        />
      </SettingItem>

      {/* Font Size */}
      <SettingItem
        icon={Maximize2}
        title={t('fontSize')}
        description={t('fontSizeDesc')}
      >
        <SelectInput
          value={settings.fontSize}
          onChange={(value) => updateSetting('fontSize', value)}
          options={fontSizeOptions}
        />
      </SettingItem>

      {/* Primary Color */}
      <SettingItem
        icon={Palette}
        title={t('primaryColor')}
        description={t('colorDesc')}
      >
        <ColorPicker
          value={settings.primaryColor}
          onChange={(value) => updateSetting('primaryColor', value)}
          options={colorOptions}
        />
      </SettingItem>

      {/* Animations */}
      <SettingItem
        icon={Sparkles}
        title={t('animations')}
        description={t('animationsDesc')}
      >
        <ToggleSwitch
          checked={settings.animations}
          onChange={(checked) => updateSetting('animations', checked)}
        />
      </SettingItem>

      {/* Compact Mode */}
      <SettingItem
        icon={Maximize2}
        title={t('compactMode')}
        description={t('compactModeDesc')}
      >
        <ToggleSwitch
          checked={settings.compactMode}
          onChange={(checked) => updateSetting('compactMode', checked)}
        />
      </SettingItem>
    </div>
  );
}