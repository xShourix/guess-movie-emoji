export default function Popup({popupText, setPopupText}) {
    return (
        <div id="popup">
            <button className="close-button" onClick={() => setPopupText("")}>X</button>
            <p>{popupText}</p>
        </div>
    );
}