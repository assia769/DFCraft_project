import HomePage from "../../../pages/HomePage/HomePage.jsx";
import TodoPage from "../../../pages/TodoPage/TodoPage.jsx";
import TrackingPage from "../../../pages/TrakingPage/TrakingPage.jsx";
import SoundPlayerPage from "../../../pages/SoundPlayerPage/SoundPlayerPage.jsx";
import SettingsPage from "../../../pages/SettingsPage/SettingPage.jsx";
import DistractionBlockingPage from "../../../pages/DistractionBlockingPage/DistractionBlockingPage.jsx";

export default function Body({ choosenPage }) {

  const renderPage = () => {
    console.log("cest la page chosie" , choosenPage)
    switch (choosenPage) {
      case "home":
        return <HomePage />;
      case "todo":
        return <TodoPage />;
      case "tracking":
        return <TrackingPage />;
      case "sounds":
        return <SoundPlayerPage />;
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
