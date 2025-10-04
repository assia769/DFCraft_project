import { useState } from "react";
import InputAddUrl from "../../components/Input/InputAddUrl";
import UrlList from "../../components/List/UrlList";
import SelectUrlState from "../../components/MultiSelect/SelectUrlState";
import SuggestionButton from "../../components/Button/SuggestionButton";
import SuggestionDialog from "../../components/Dialog/SuggestionDialog";
import useBlockUrl from "../../hooks/useBlockUrl";
import useSaveUrl from "../../hooks/useSaveUrl";

const DistractionBlockingPage = () => {
  const [urlElements, setUrlElement] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  useBlockUrl(urlElements);
  useSaveUrl(urlElements);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 border-b">
        <SelectUrlState setElements={setUrlElement} />
        <SuggestionButton setShowDialog={setShowDialog} />
      </header>
      <section className="p-4">
        <InputAddUrl elements={urlElements} setElement={setUrlElement} />
        <UrlList urlElements={urlElements} setUrlElements={setUrlElement} />
        <SuggestionDialog show={showDialog} setShowDialog={setShowDialog} />
      </section>
    </div>
  );
};

export default DistractionBlockingPage;
