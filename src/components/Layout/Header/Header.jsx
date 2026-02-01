import { Menu, X, Home, AudioLines, BarChart3, Shield, Settings, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "../../../shared/context/SettingsContext";
import { useTranslation } from "../../../shared/i18n/translations";

export default function Header({ setChoosenPage }) {
  const [showMenu, setShowMenu] = useState(false);
  const [urlLogo, setUrlLogo] = useState("");
  const [activeRoute, setActiveRoute] = useState("home");
  
  // Utiliser les paramètres globaux
  const { settings } = useSettings();
  const { t } = useTranslation(settings.language);

  useEffect(() => {
    try {
      if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
        setUrlLogo(browser.runtime.getURL("icons/LOGO.png"));
      } else {
        setUrlLogo("icons/LOGO.png");
      }
    } catch (error) {
      console.error("Extension API not available:", error);
      setUrlLogo("icons/LOGO.png");
    }
  }, []);

  const menuItems = [
    { id: "home", labelKey: "home", icon: Home },
    { id: "sounds", labelKey: "sounds", icon: AudioLines },
    { id: "todo", labelKey: "tasks", icon: ListChecks },
    { id: "distractionBlocking", labelKey: "blockPages", icon: Shield },
    { id: "tracking", labelKey: "progress", icon: BarChart3 },
    { id: "settings", labelKey: "settings", icon: Settings },
  ];
  
  const handleNavigation = (pageId) => {
    setActiveRoute(pageId);
    setChoosenPage(pageId);
    setShowMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-light dark:bg-dark">
        <div className="px-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("home")}>
              <img src={urlLogo} alt="Logo" className="w-[40%] h-auto" />
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 transition-colors relative"
              aria-label="Menu"
            >
              {showMenu ? (
                <X className="w-6 h-6 text-lightElements dark:text-darkElements" />
              ) : (
                <Menu className="w-6 h-6 text-lightElements dark:text-darkElements" />
              )}
            </button>
          </div>
        </div>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 bg-light/20 dark:bg-dark/20 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />
            
            <div className="absolute right-4 top-16 w-44 bg-lightElements dark:bg-darkElements rounded-2xl shadow-2xl overflow-hidden animate-slideIn">
              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-lightList dark:hover:bg-darkList text-light dark:text-dark ${
                        isActive
                          ? "bg-lightList dark:bg-darkList"
                          : "bg-lightElements dark:bg-darkElements"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </header>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}