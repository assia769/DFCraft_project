import { Moon, Type, Palette, Maximize2, Sparkles } from 'lucide-react';
import { useSettings } from '../../shared/context/SettingsContext';
import { useSettingsTranslation } from '../../shared/i18n/settingsTranslations';
import SettingItem from './SettingItem';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';
import ColorPicker from './ColorPicker';

export default function AppearanceSettings() {
  const { settings, updateSetting } = useSettings();
  const { t } = useSettingsTranslation(settings.settingsLanguage);

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

      {/* Preview Section */}
      <div className="mt-6 p-6 bg-light dark:bg-dark rounded-xl border border-lightPlaceHolder/30 dark:border-darkPlaceHolder/30">
        <h3 className="text-lg font-semibold text-lightElements dark:text-darkElements mb-3">
          Aperçu des paramètres
        </h3>
        <div className="space-y-2 text-lightPlaceHolder dark:text-darkPlaceHolder">
          <p>• Police: <span className="font-semibold text-lightElements dark:text-darkElements">{settings.font}</span></p>
          <p>• Taille: <span className="font-semibold text-lightElements dark:text-darkElements">{settings.fontSize}</span></p>
          <p>• Thème: <span className="font-semibold text-lightElements dark:text-darkElements">{settings.primaryColor}</span></p>
          <p>• Mode: <span className="font-semibold text-lightElements dark:text-darkElements">{settings.darkMode ? 'Sombre' : 'Clair'}</span></p>
        </div>
      </div>
    </div>
  );
}