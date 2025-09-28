import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ setChoosenPage }) {
  const [showMenu, setShowMenu] = useState(false);
  const [urlLogo, setUrlLogo] = useState("");

  useEffect(() => {
    try {
      if (browser && browser.runtime && browser.runtime.getURL) {
        setUrlLogo(browser.runtime.getURL("icons/icon-16.png"));;
      } else {
        // Fallback for development or non-extension context
        setUrlLogo("/icons/icon-16.png");
      }
    } catch (error) {
      console.error("Extension API not available:", error);
      setUrlLogo("/icons/icon-16.png");
    }
  }, []);

  const toggleMenu = () => {
    return (
      showMenu && (
        <>
          <div className="absolute p-2 bg-gray-400 top-10 right-2 rounded-sm">
            <p onClick={() => setChoosenPage("home")}>Home</p>
            <p onClick={() => setChoosenPage("todo")}>Todo list</p>
            <p onClick={() => setChoosenPage("sounds")}>Sounds</p>
            <p onClick={() => setChoosenPage("tracking")}>Tracking</p>
            <p onClick={() => setChoosenPage("settings")}>Settings</p>
          </div>
        </>
      )
    );
  };
  return (
    <header className="p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={urlLogo} alt="Logo" className="w-[15px] h-auto mr-1" />
          <h3 className="">DFCraft</h3>
        </div>
        <Menu color="black" onClick={() => setShowMenu(!showMenu)} />
      </div>

      {toggleMenu()}
    </header>
  );
}
