import { useState, useEffect } from 'react';
import { Settings, Bell, Moon, Volume2, Clock, Shield, Palette, Download, Trash2, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    soundNotifications: true,
    desktopNotifications: false,
    theme: 'light',
    accentColor: '#3b82f6',
    fontSize: 'medium',
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundVolume: 70,
    tickingSound: false,
    alarmSound: 'bell',
    strictMode: false,
    blockDuringBreaks: false,
    language: 'fr',
    startOnLaunch: false,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Appliquer le thème immédiatement
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.theme);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
  }, [settings.theme, settings.accentColor, settings.fontSize]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('settingsChanged', { 
      detail: newSettings 
    }));
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      localStorage.removeItem('appSettings');
      window.location.reload();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-backup.json';
    link.click();
  };

  const containerClass = settings.theme === 'dark' 
    ? 'min-h-screen bg-gray-900 p-6' 
    : 'min-h-screen bg-gray-50 p-6';

  const cardClass = settings.theme === 'dark'
    ? 'bg-gray-800 rounded-lg shadow-sm p-6 mb-6'
    : 'bg-white rounded-lg shadow-sm p-6 mb-6';

  const textClass = settings.theme === 'dark'
    ? 'text-gray-100'
    : 'text-gray-800';

  const subtextClass = settings.theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-600';

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[settings.fontSize];

  return (
    <div className={`${containerClass} ${fontSizeClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8" style={{ color: settings.accentColor }} />
            <h1 className={`text-3xl font-bold ${textClass}`}>
              {settings.language === 'fr' ? 'Paramètres' : 
               settings.language === 'en' ? 'Settings' : 
               settings.language === 'es' ? 'Configuración' : 'الإعدادات'}
            </h1>
          </div>
          <p className={subtextClass}>
            {settings.language === 'fr' ? 'Personnalisez votre expérience' : 
             settings.language === 'en' ? 'Customize your experience' : 
             settings.language === 'es' ? 'Personaliza tu experiencia' : 'خصص تجربتك'}
          </p>
        </div>

        {/* Notifications */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>
              {settings.language === 'fr' ? 'Notifications' : 
               settings.language === 'en' ? 'Notifications' : 
               settings.language === 'es' ? 'Notificaciones' : 'الإشعارات'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting
              label={settings.language === 'fr' ? 'Activer les notifications' : 
                     settings.language === 'en' ? 'Enable notifications' : 
                     settings.language === 'es' ? 'Activar notificaciones' : 'تفعيل الإشعارات'}
              checked={settings.enableNotifications}
              onChange={(val) => handleSettingChange('enableNotifications', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Notifications sonores' : 
                     settings.language === 'en' ? 'Sound notifications' : 
                     settings.language === 'es' ? 'Notificaciones sonoras' : 'إشعارات صوتية'}
              checked={settings.soundNotifications}
              onChange={(val) => handleSettingChange('soundNotifications', val)}
              disabled={!settings.enableNotifications}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Notifications bureau' : 
                     settings.language === 'en' ? 'Desktop notifications' : 
                     settings.language === 'es' ? 'Notificaciones de escritorio' : 'إشعارات سطح المكتب'}
              checked={settings.desktopNotifications}
              onChange={(val) => handleSettingChange('desktopNotifications', val)}
              disabled={!settings.enableNotifications}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
          </div>
        </div>

        {/* Apparence */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>
              {settings.language === 'fr' ? 'Apparence' : 
               settings.language === 'en' ? 'Appearance' : 
               settings.language === 'es' ? 'Apariencia' : 'المظهر'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <SelectSetting
              label={settings.language === 'fr' ? 'Thème' : 
                     settings.language === 'en' ? 'Theme' : 
                     settings.language === 'es' ? 'Tema' : 'السمة'}
              value={settings.theme}
              options={[
                { value: 'light', label: settings.language === 'fr' ? 'Clair' : settings.language === 'en' ? 'Light' : settings.language === 'es' ? 'Claro' : 'فاتح' },
                { value: 'dark', label: settings.language === 'fr' ? 'Sombre' : settings.language === 'en' ? 'Dark' : settings.language === 'es' ? 'Oscuro' : 'داكن' },
                { value: 'auto', label: settings.language === 'fr' ? 'Automatique' : settings.language === 'en' ? 'Auto' : settings.language === 'es' ? 'Automático' : 'تلقائي' }
              ]}
              onChange={(val) => handleSettingChange('theme', val)}
              theme={settings.theme}
            />
            
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>
                {settings.language === 'fr' ? "Couleur d'accent" : 
                 settings.language === 'en' ? 'Accent color' : 
                 settings.language === 'es' ? 'Color de acento' : 'لون التمييز'}
              </label>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                className="h-10 w-20 rounded cursor-pointer border border-gray-300"
              />
            </div>

            <SelectSetting
              label={settings.language === 'fr' ? 'Taille du texte' : 
                     settings.language === 'en' ? 'Text size' : 
                     settings.language === 'es' ? 'Tamaño del texto' : 'حجم النص'}
              value={settings.fontSize}
              options={[
                { value: 'small', label: settings.language === 'fr' ? 'Petit' : settings.language === 'en' ? 'Small' : settings.language === 'es' ? 'Pequeño' : 'صغير' },
                { value: 'medium', label: settings.language === 'fr' ? 'Moyen' : settings.language === 'en' ? 'Medium' : settings.language === 'es' ? 'Mediano' : 'متوسط' },
                { value: 'large', label: settings.language === 'fr' ? 'Grand' : settings.language === 'en' ? 'Large' : settings.language === 'es' ? 'Grande' : 'كبير' }
              ]}
              onChange={(val) => handleSettingChange('fontSize', val)}
              theme={settings.theme}
            />
          </div>
        </div>

        {/* Timer */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>Timer Pomodoro</h2>
          </div>
          
          <div className="space-y-4">
            <NumberSetting
              label={settings.language === 'fr' ? 'Durée Pomodoro (minutes)' : 
                     settings.language === 'en' ? 'Pomodoro duration (minutes)' : 
                     settings.language === 'es' ? 'Duración Pomodoro (minutos)' : 'مدة البومودورو (دقائق)'}
              value={settings.pomodoroTime}
              min={1}
              max={60}
              onChange={(val) => handleSettingChange('pomodoroTime', val)}
              theme={settings.theme}
            />
            <NumberSetting
              label={settings.language === 'fr' ? 'Pause courte (minutes)' : 
                     settings.language === 'en' ? 'Short break (minutes)' : 
                     settings.language === 'es' ? 'Pausa corta (minutos)' : 'استراحة قصيرة (دقائق)'}
              value={settings.shortBreakTime}
              min={1}
              max={30}
              onChange={(val) => handleSettingChange('shortBreakTime', val)}
              theme={settings.theme}
            />
            <NumberSetting
              label={settings.language === 'fr' ? 'Pause longue (minutes)' : 
                     settings.language === 'en' ? 'Long break (minutes)' : 
                     settings.language === 'es' ? 'Pausa larga (minutos)' : 'استراحة طويلة (دقائق)'}
              value={settings.longBreakTime}
              min={1}
              max={60}
              onChange={(val) => handleSettingChange('longBreakTime', val)}
              theme={settings.theme}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Démarrer automatiquement les pauses' : 
                     settings.language === 'en' ? 'Auto-start breaks' : 
                     settings.language === 'es' ? 'Iniciar pausas automáticamente' : 'بدء الاستراحات تلقائيًا'}
              checked={settings.autoStartBreaks}
              onChange={(val) => handleSettingChange('autoStartBreaks', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Démarrer automatiquement les pomodoros' : 
                     settings.language === 'en' ? 'Auto-start pomodoros' : 
                     settings.language === 'es' ? 'Iniciar pomodoros automáticamente' : 'بدء البومودورو تلقائيًا'}
              checked={settings.autoStartPomodoros}
              onChange={(val) => handleSettingChange('autoStartPomodoros', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
          </div>
        </div>

        {/* Sons */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>
              {settings.language === 'fr' ? 'Sons' : 
               settings.language === 'en' ? 'Sounds' : 
               settings.language === 'es' ? 'Sonidos' : 'الأصوات'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>
                Volume: {settings.soundVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.soundVolume}
                onChange={(e) => handleSettingChange('soundVolume', parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: settings.accentColor }}
              />
            </div>
            <ToggleSetting
              label={settings.language === 'fr' ? 'Son de tic-tac' : 
                     settings.language === 'en' ? 'Ticking sound' : 
                     settings.language === 'es' ? 'Sonido de tic-tac' : 'صوت التكتكة'}
              checked={settings.tickingSound}
              onChange={(val) => handleSettingChange('tickingSound', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
            <SelectSetting
              label={settings.language === 'fr' ? "Son d'alarme" : 
                     settings.language === 'en' ? 'Alarm sound' : 
                     settings.language === 'es' ? 'Sonido de alarma' : 'صوت المنبه'}
              value={settings.alarmSound}
              options={[
                { value: 'bell', label: settings.language === 'fr' ? 'Cloche' : settings.language === 'en' ? 'Bell' : settings.language === 'es' ? 'Campana' : 'جرس' },
                { value: 'chime', label: settings.language === 'fr' ? 'Carillon' : settings.language === 'en' ? 'Chime' : settings.language === 'es' ? 'Carillón' : 'صلصلة' },
                { value: 'digital', label: 'Digital' },
                { value: 'nature', label: settings.language === 'fr' ? 'Nature' : settings.language === 'en' ? 'Nature' : settings.language === 'es' ? 'Naturaleza' : 'طبيعة' }
              ]}
              onChange={(val) => handleSettingChange('alarmSound', val)}
              theme={settings.theme}
            />
          </div>
        </div>

        {/* Blocage */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>
              {settings.language === 'fr' ? 'Blocage de distractions' : 
               settings.language === 'en' ? 'Distraction blocking' : 
               settings.language === 'es' ? 'Bloqueo de distracciones' : 'حظر المشتتات'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting
              label={settings.language === 'fr' ? 'Mode strict (blocage total)' : 
                     settings.language === 'en' ? 'Strict mode (full blocking)' : 
                     settings.language === 'es' ? 'Modo estricto (bloqueo total)' : 'وضع صارم (حظر كامل)'}
              checked={settings.strictMode}
              onChange={(val) => handleSettingChange('strictMode', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Bloquer pendant les pauses' : 
                     settings.language === 'en' ? 'Block during breaks' : 
                     settings.language === 'es' ? 'Bloquear durante las pausas' : 'الحظر أثناء الاستراحات'}
              checked={settings.blockDuringBreaks}
              onChange={(val) => handleSettingChange('blockDuringBreaks', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
          </div>
        </div>

        {/* Général */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" style={{ color: settings.accentColor }} />
            <h2 className={`text-xl font-semibold ${textClass}`}>
              {settings.language === 'fr' ? 'Général' : 
               settings.language === 'en' ? 'General' : 
               settings.language === 'es' ? 'General' : 'عام'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <SelectSetting
              label={settings.language === 'fr' ? 'Langue' : 
                     settings.language === 'en' ? 'Language' : 
                     settings.language === 'es' ? 'Idioma' : 'اللغة'}
              value={settings.language}
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'ar', label: 'العربية' }
              ]}
              onChange={(val) => handleSettingChange('language', val)}
              theme={settings.theme}
            />
            <ToggleSetting
              label={settings.language === 'fr' ? 'Démarrer au lancement' : 
                     settings.language === 'en' ? 'Start on launch' : 
                     settings.language === 'es' ? 'Iniciar al arrancar' : 'البدء عند التشغيل'}
              checked={settings.startOnLaunch}
              onChange={(val) => handleSettingChange('startOnLaunch', val)}
              theme={settings.theme}
              accentColor={settings.accentColor}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: settings.accentColor }}
            >
              <Download className="w-4 h-4" />
              {settings.language === 'fr' ? 'Exporter les données' : 
               settings.language === 'en' ? 'Export data' : 
               settings.language === 'es' ? 'Exportar datos' : 'تصدير البيانات'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {settings.language === 'fr' ? 'Réinitialiser' : 
               settings.language === 'en' ? 'Reset' : 
               settings.language === 'es' ? 'Restablecer' : 'إعادة تعيين'}
            </button>
          </div>
        </div>

        <div className={`text-center mt-8 ${subtextClass} text-sm`}>
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, checked, onChange, disabled = false, theme, accentColor }) {
  const textClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  
  return (
    <div className="flex items-center justify-between">
      <span className={`${textClass} ${disabled ? 'opacity-50' : ''}`}>{label}</span>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ backgroundColor: checked ? accentColor : (theme === 'dark' ? '#4B5563' : '#D1D5DB') }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SelectSetting({ label, value, options, onChange, theme }) {
  const textClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bgClass = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900';
  
  return (
    <div>
      <label className={`block text-sm font-medium ${textClass} mb-2`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgClass}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberSetting({ label, value, min, max, onChange, theme }) {
  const textClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const bgClass = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900';
  
  return (
    <div>
      <label className={`block text-sm font-medium ${textClass} mb-2`}>
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgClass}`}
      />
    </div>
  );
}