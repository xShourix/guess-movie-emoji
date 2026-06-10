export default function EditPopup({popupEditText, setPopupEditText, editTitle, setEditTitle, editAnswer, setEditAnswer, setEditMovieId, handleUpdate}) {
    function handleClose() {
        setPopupEditText("");
        setEditTitle("");
        setEditAnswer("");
        setEditMovieId(null);
    }
    return (
        <div id="popup">
            <button className="close-button" onClick={() => handleClose()}>X</button>
            <h3>{popupEditText}</h3>
            <h5>Answer:</h5>
            <input type="text" value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} placeholder="✍🏼🎥💬..." className="search-input" />
            <h5>Movie title:</h5>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Type movie title..." className="search-input" />
            <input type="button" value="Save" className="button" onClick={() => handleUpdate()} />
        </div>
    );
}