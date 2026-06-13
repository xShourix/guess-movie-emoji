import { useState, useEffect } from "react";
import Popup from "../components/Popup";

export default function Home() {
  const [popupText, setPopupText] = useState("");

  const [mode, setMode] = useState("play");
  const [seenIds, setSeenIds] = useState([]);
  const [riddleCount, setRiddleCount] = useState(0);

  const [riddle, setRiddle] = useState({});

  const [userAnswer, setUserAnswer] = useState("");
  const [wrongAnswer, setWrongAnswer] = useState(false);

  async function checkRiddleCount(){
    try {
      const response = await fetch(
        "http://localhost/guess-movie-emoji/api/riddleApi.php?count=true"
      );
      
      if (!response.ok) {
        setPopupText("Error checking riddle count");
        return;
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error("Error checking riddle count:", error);
      return;
    }
  }

  async function fetchRiddle(ids) {
    try {
      const response = await fetch(
        "http://localhost/guess-movie-emoji/api/riddleApi.php?exclude=" +
        ids.join(",")
      );
      const data = await response.json();

      if (!response.ok) {
        setPopupText("Error fetching riddle");
        return;
      }

      if (data.finished) {
        const lastId = ids[ids.length - 1];
        setSeenIds([]);

        if (lastId == null) {
          fetchRiddle([]);
          return;
        }
        
        fetchRiddle([lastId]);
        return;
      }

      setRiddle(data.riddle);
      setSeenIds([...ids, data.riddle.id]);
    } catch (error) {
      console.error("Error fetching riddle:", error);
    }
  }

  function checkAnswer(userAnswer) {
    if (riddle.title && userAnswer.trim().toLowerCase() === riddle.title.trim().toLowerCase()) {
      setMode("win");
      setUserAnswer("");
    }
    else {
      setWrongAnswer(true);

      setTimeout(() => {
        setWrongAnswer(false);
      }, 500);
    }
  }

  useEffect(() => {
    async function load() {
      const count = await checkRiddleCount();

      if (count > 0) {
        setRiddleCount(count);
        fetchRiddle([]);
      }
      else {
        setRiddleCount(0);
      }
    }

    load();
  }, []);

  return (
    <main>
      {popupText && <Popup popupText={popupText} setPopupText={setPopupText} />}
      <h1 className="textCenter"><span className="thinText">Guess</span> the movie<br/><span className="thinText">based on</span> emojis</h1>
      <hr />
        {riddleCount > 0 ?
          (
            <>
              <section>
                <h1 className="textCenter">{riddle.answer}</h1>
                {mode === "play" ? (
                  <div className="dRowCenter">
                    <input type="text" placeholder="Type your answer here..." value={userAnswer} 
                      onChange={(e) => setUserAnswer(e.target.value)} 
                      onKeyDown={(e) => {
                        if(e.key === "Enter") {
                          checkAnswer(userAnswer);
                        }
                      }}
                      className={wrongAnswer ? "wrongAnswer" : ""} 
                    />
                    <button className="primary-button" onClick={() => checkAnswer(userAnswer)}>Check</button>
                  </div>
                ) : (
                  <div className="textCenter">
                    <h2 className="riddleTitle"><span className="thinText">The title:</span> {riddle.title}</h2>
                    {mode === "win" ? <p>You got it!</p> : <p>Maybe next time!</p>}
                  </div>
                )}
              </section>
              <hr />
              <section className="dRowEnd">
                  <button className="primary-button" onClick={() => {
                      setMode(mode === "play" ? "answer" : "play")
                    }}>
                    {mode === "play" ? "Show answer" : "Hide answer"}
                  </button>
                  {riddleCount > 1 
                    && <button className="primary-button" onClick={() => {setMode("play"); fetchRiddle(seenIds);}}>Next riddle</button>
                  }
              </section>
            </>
              
          )
          : (
            <p>No riddles found.</p>
          )
        }
    </main>
  );
}