import Timer from "../../components/Timer/Timer.jsx";
import EasyTasks from "../../components/EasyTasks/EasyTasks.jsx";
import EasySoundPlayer from "../../components/EasySoundPlayer/EasySoundPlayer.jsx";
import Phases from "../../components/Phases/Phases.jsx";

export default function HomePage() {
    return (<>
      <Timer />
      <Phases />
      <EasyTasks />
      <EasySoundPlayer />
    </>)
}