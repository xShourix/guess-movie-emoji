import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import EmojiSearch from "../components/EmojiSearch";
import Popup from "../components/Popup";

export default function HandleRiddle() {
  const { id } = useParams();
  const isEdit = (id !== undefined);

  const [answer, setAnswer] = useState("");
  const [title, setTitle] = useState("");
  const [popupText, setPopupText] = useState("");

    async function fetchRiddle() {
      try {
        const response = await fetch(`http://localhost/guess-movie-emoji/api/riddleApi.php?id=${id}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        if (!response.ok) {
          setPopupText("Failed to fetch riddle");
          return;
        }
        const data = await response.json();
        setTitle(data.title);
        setAnswer(data.answer);
      } catch (error) {
        console.error(error);
        setPopupText("Error fetching riddle");
      }
  }

  async function addRiddle() {
    if (title === "" || answer === "") {
      setPopupText("Please fill in both fields");
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

      if (!response.ok) {
        setPopupText("Failed to add riddle");
      }
      else {
        setTitle("");
        setAnswer("");
        setPopupText("Riddle added successfully!");
      }
    } catch (error) {
      console.error(error);
      setPopupText("Error adding riddle");
    }
  }

  async function updateRiddle() {
    if (title === "" || answer === "") {
      setPopupText("Please fill in both fields");
      return;
    }
    try {
      const response = await fetch("http://localhost/guess-movie-emoji/api/riddleApi.php",{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            answer,
            title,
          }),
        }
      );

      if (!response.ok) {
        setPopupText("Failed to edit riddle");
        return;
      }
      setPopupText("Riddle edited successfully!");
    } catch (error) {
      console.error(error);
      setPopupText("Error editting riddle");
    }
  }

  useEffect(() => {
    if(isEdit) {
      fetchRiddle();
    }
  }, [id]);
  
  
  return (
    <main>
      {popupText && <Popup popupText={popupText} setPopupText={setPopupText} />}
      <h1>{isEdit ? <span className="thinText">Edit</span> : <span className="thinText">Add</span>} a riddle</h1>
      <hr />
      <section>
        <div>
          {isEdit && 
            <h2>Quiz id: <span className="thinText">{id}</span></h2>
          }
          <label>
            <h2>Riddle</h2>
            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="✍🏼🎥💬..." className="w100" />
          </label>
          <label>
            <h2>Title</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type movie title..." className="w100" /> 
          </label>
        </div>
        {isEdit ? (<input type="button" value="Update" className="button" onClick={updateRiddle} />) : (<input type="button" value="Add" className="button" onClick={addRiddle} />)}
      </section>
      <EmojiSearch setAnswer={setAnswer} />
    </main>
  );
}