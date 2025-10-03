


const SuggestionButton = ({setShowDialog })=>{

    function handleShowDial(){
        setShowDialog(true)
    }
    return (
        <div>
            <button  onClick={()=>{handleShowDial()}} >
                Suggestion
            </button>
        </div>
    )
}

export default SuggestionButton