import { useEffect, useState } from "react";
import InputAddUrl from "../../components/Input/InputAddUrl";
import UrlList from "../../components/List/UrlList";
import SelectUrlState from "../../components/MultiSelect/SelectUrlState";
import { Shield, Trash } from "lucide-react";
import { X } from "lucide-react";
import useSaveUrl from "../../shared/hooks/useSaveUrl";
import InputSearch from "../../components/Input/inputSearch";

const DistractionBlockingPage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const [selectedElement, setSelectedElement] = useState([]);
    const [searchedElement, setsearchedElement] = useState([]) ;
    const [isDelete, setisDelete] = useState(false);
     const [searchedValue, setSearchedValue] = useState("");

    const { urlElements, setUrlElement } = useSaveUrl()

    const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    setIsShaking(true);
    // On retire la classe après la fin de l'animation (200ms)
    setTimeout(() => setIsShaking(false), 200);
  };
    function handleDelete() {
        setUrlElement((prv) => prv.filter((item) => !selectedElement.includes(item)));
        setSelectedElement([]);
        setisDelete(false); 
        
    }

    useEffect(() => {
        console.log("selectedElement", selectedElement)
        if (selectedElement.length > 0) {
            setisDelete(true);
            setShowAddInput(false)
        } else {
            setisDelete(false);
        }

    } , [selectedElement])


    return (
        <div className="min-h-[100%]  relative overflow-hidden   dark:bg-dark  bg-light p-2 pl-4">
            <header className="flex justify-center  items-center p-4 ">
                <Shield size={70} className="dark:text-darkFontText text-lightFontText" />
            </header>
            <div className="flex flex-col   justify-center items-center">
                <h1 className="text-3xl text-lightFontText dark:text-darkFontText   ">
                    Web Distraction Blocking
                </h1>
                <div className="flex gap-1 items-center  w-[85%]  justify-center">
                    <InputSearch Element={urlElements} value={searchedValue}  setValue={setSearchedValue} setSearchedElement={setsearchedElement} />    
                    <div className="w-1/2 ">
                        <SelectUrlState setElements={setUrlElement} />
                    </div>
                </div>

            </div>
            <section className="p-4  rounded-xl text-darkFontText text-[17px] dark:text-white mt-3 dark:text-lightFontTextmt-3 dark:bg-[#251932] dark:shadow-[inset_10px_10px_37px_-16px_rgba(127,45,191,0.27)] bg-[#7C3AED] z-10">
                <header
                    onClick={() => setShowAddInput(false)}
                    className="w-full relative h-auto overflow-hidden">
                    <div className="w-full h-[41px] " >
                        <div className={`w-full absolute z-1   ${showAddInput ? "bottom-0" : "bottom-[-50px]"} transition-all duration-300 ease-in-out `}>
                            <InputAddUrl elements={urlElements} setElement={setUrlElement} setShowAddInput={setShowAddInput} />
                        </div>
                        {
                            isDelete ? (
                                <>
                            
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        className={`w-[30px] h-[30px] bg-[#A855F7] rounded-full flex items-center justify-center transition-all cursor-pointer ml-auto ${isShaking ? 'animate-shake' : ''}`}
                                    >
                                        <Trash size={20} />
                                    </span>
                                </>
                            ) : (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAddInput(true);
                                    }}
                                    className={`w-[30px] h-[30px] bg-[#A855F7] rounded-full flex items-center justify-center transition-all cursor-pointer transform  ml-auto ${showAddInput ? "rotate-45" : "rotate-225"}`}>
                                    <X size={20} />
                                </span>
                            )
                        }


                    </div>
                </header>

                {
                    searchedValue !== "" ? 
                    
                    searchedElement.length > 0 ? (
                        <UrlList urlElements={searchedElement}  setUrlElements={setUrlElement} setSelectedElement={setSelectedElement} />
                    ) : (
                        <div className="text-center p-4">Cette url n'existe pas </div>
                    )
                  :
                (
                        <UrlList urlElements={urlElements}  setUrlElements={setUrlElement} setSelectedElement={setSelectedElement} />
                    )
                        
                }

               


            </section>

            <div className="absolute h-[50%] w-[50%]  bottom-[-25%] left-[50%]  blur-[50px]     dark:bg-darkElements bg-[#A855F7] z-[-1]">
            </div>
        </div>
    );
};



export default DistractionBlockingPage;
