
import { useState } from "react";
import InputAddUrl from "../../components/Input/InputAddUrl";
import UrlList from "../../components/List/UrlList";
import SelectUrlState from "../../components/MultiSelect/SelectUrlState";
import SuggestionButton from "../../components/Button/SuggestionButton";
import SuggestionDialog from "../../components/Dialog/SuggestionDialog";
const  DistractionBlockingPage = ()=>{

    const [urlElements , setUrlElement] = useState([])
    const [showDialog , setShowDialog] = useState(false)

    return(
        <div>
            <header>
                <SelectUrlState setElements={setUrlElement}></SelectUrlState>
                <SuggestionButton showDialog = {showDialog}></SuggestionButton>
             </header>
            <section>
                    <InputAddUrl elements={urlElements} setElement={setUrlElement}></InputAddUrl>
                    <UrlList urlElements ={urlElements}  setUrlElements={setUrlElement}></UrlList>
                    <SuggestionDialog show={showDialog}></SuggestionDialog>
            </section>
        </div>
    )
}


export default DistractionBlockingPage ; 