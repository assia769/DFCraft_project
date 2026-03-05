import Header from "../Header/Header.jsx";
import Body from "../Body/Boudy.jsx";
import Footer from "../Fouter/Fouter.jsx";
import { useState } from "react";
import { TimerProvider } from "../../../shared/providers/TimerProvider.jsx";
import { UrlProvider } from "../../../shared/providers/UrlProvider.jsx";

export default function MainLayout() {
  const [choosenPage, setChoosenPage] = useState("");


  return (
    <>
      <TimerProvider>
        <Header setChoosenPage={setChoosenPage} />
        <UrlProvider>
          <Body choosenPage={choosenPage} />
        </UrlProvider>
        <Footer />
      </TimerProvider>
    </>
  );
}
