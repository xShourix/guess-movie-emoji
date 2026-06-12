export default function Popup({popupText, setPopupText}) {
    return (
        <div id="popup">
            <div className="popupContent">    
                <button className="closePopup" onClick={() => setPopupText("")}>X</button>
                <p>{popupText}</p>
            </div>
        </div>
    );
}