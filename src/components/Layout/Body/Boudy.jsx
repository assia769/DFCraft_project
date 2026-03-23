import HomePage from "../../../pages/HomePage/HomePage.jsx";
import TodoPage from "../../../pages/TodoPage/TodoPage.jsx";
import SoundPlayerPage from "../../../pages/SoundPlayerPage/SoundPlayerPage.jsx";
import SettingsPage from "../../../pages/SettingsPage/SettingPage.jsx";
import DistractionBlockingPage from "../../../pages/DistractionBlockingPage/DistractionBlockingPage.jsx";
import { browserAPI } from "../../../shared/utils/browserAPI.js";

export default function Body({ choosenPage }) {

  const renderPage = () => {
    console.log("cest la page chosie" , choosenPage)
    switch (choosenPage) {
      case "home":
        return <HomePage />;
      case "todo":
        return <TodoPage />;
      // case "tracking":
      //   browserAPI.tabs.create({ url: browserAPI.runtime.getURL("staticPages/statist.html") });
      //   window.close();
      case "tracking":
  browserAPI.tabs.create({ url: "https://dfcraft.vercel.app/track" });
  window.close();
  return null;
      case "sounds":
        return <SoundPlayerPage/>;
      case "distractionBlocking":
        return <DistractionBlockingPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderPage()}</>;
}
