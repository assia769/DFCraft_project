import { Menu, X, Home, ListTodo, Volume2, BarChart3, Shield, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ setChoosenPage }) {
  const [showMenu, setShowMenu] = useState(false);
  const [urlLogo, setUrlLogo] = useState("");
  const [activeRoute, setActiveRoute] = useState("home");

  useEffect(() => {
    try {
      if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
        setUrlLogo(browser.runtime.getURL("icons/icon-16.png"));
      } else {
        setUrlLogo("/icons/icon-16.png");
      }
    } catch (error) {
      console.error("Extension API not available:", error);
      setUrlLogo("/icons/icon-16.png");
    }
  }, []);

  const menuItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "todo", label: "Tâches", icon: ListTodo },
    { id: "sounds", label: "Sons", icon: Volume2 },
    { id: "tracking", label: "Suivi", icon: BarChart3 },
    { id: "distractionBlocking", label: "Blocage", icon: Shield },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const handleNavigation = (pageId) => {
    setActiveRoute(pageId);
    setChoosenPage(pageId);
    setShowMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("home")}>
              <img src={urlLogo} alt="Logo" className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-none">DFCraft</h3>
                <p className="text-xs text-gray-500">Focus Timer</p>
              </div>
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="Menu"
            >
              {showMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />
            
            <div className="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideIn">
              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Version 1.0.0
                </p>
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