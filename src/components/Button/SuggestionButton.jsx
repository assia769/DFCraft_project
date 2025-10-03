const SuggestionButton = ({ setShowDialog }) => {
    function handleShowDial(){
        setShowDialog(true);
    }
    return (
        <div className="text-center">
            <button onClick={handleShowDial} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Suggestion
            </button>
        </div>
    );
};

export default SuggestionButton;