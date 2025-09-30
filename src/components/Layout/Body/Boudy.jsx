import HomePage from "../../../pages/HomePage/HomePage.jsx";
import TodoPage from "../../../pages/TodoPage/TodoPage.jsx";
import TrackingPage from "../../../pages/TrakingPage/TrakingPage.jsx";
import SoundPlayerPage from "../../../pages/SoundPlayerPage/SoundPlayerPage.jsx";
import SettingsPage from "../../../pages/SettingsPage/SettingPage.jsx";

export default function Body({ choosenPage }) {
  const renderPage = () => {
    switch (choosenPage) {
      case "home":
        return <HomePage />;
      case "todo":
        return <TodoPage />;
      case "tracking":
        return <TrackingPage />;
      case "sounds":
        return <SoundPlayerPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderPage()}</>;
}
