import { useState, useEffect } from "react";
import EmojiSearch from "../components/EmojiSearch";

export default function AddQuiz() {
  const [answer, setAnswer] = useState("");
  const [title, setTitle] = useState("");

  async function addPopup(popupText) {
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = "<button onclick={{document.getElementById('popup').remove()}}>X</button><p>"+popupText+"</p>";
    document.body.appendChild(popup);
  }
  async function addRiddle() {
    if (title === "" || answer === "") {
      addPopup("Please fill in both fields");
      return;
    }
    try {
      const response = await fetch("http://localhost/guess-movie-emoji/api/riddleApi.php",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            answer,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setTitle("");
        setAnswer("");
        addPopup("Riddle added successfully!");
      }
      else {
        addPopup("Failed to add riddle");
      }
    } catch (error) {
      console.error(error);
      addPopup("Error adding riddle");
    }
  }

  return (
    <main>
      <h1><span className="thinText">Add</span> new riddle</h1>
      <input id="emoji-input" type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="✍🏼🎥💬..." className="emoji-input" />
      <div className="dRowCenter">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type movie title..." className="search-input" />
        <input type="button" value="Add" className="button" onClick={addRiddle} />
      </div>
      <EmojiSearch setAnswer={setAnswer} />
    </main>
  );
}