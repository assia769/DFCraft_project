import React from "react";

const SuggestionDialog = ({ show }) => {
    if (!show) return null;
    const handleCloseDialog = () => {
        setShowDialog(false); // cache le dialogue
    };
    return (
        <div
            style={{
                width: "100%",        // prend toute la largeur du parent
                height: "100%",       // prend toute la hauteur du parent
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",  // pas fixed, il suit son parent
            }}
        >
            <div
                style={{
                    width: "100%",      // prend toute la largeur du container
                    height: "100%",     // prend toute la hauteur du container
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "0px", // optionnel : on enlève les coins arrondis si on veut full size
                    textAlign: "center",
                    boxSizing: "border-box", // pour inclure padding dans la taille
                }}
            >
                <h2>Suggestions</h2>
                <p>Ici tu peux mettre des suggestions ou du contenu personnalisé.</p>
                <button onClick={handleCloseDialog}>Fermer</button>
            </div>
        </div>

    );
};

export default SuggestionDialog;
