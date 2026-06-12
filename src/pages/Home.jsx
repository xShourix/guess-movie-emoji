import { useState, useEffect } from "react";
import { useRef } from "react";

export default function Home() {
  const [mode, setMode] = useState("play");
  const [win, setWin] = useState(false);
  const [seenIds, setSeenIds] = useState([]);
  const [riddleCount, setRiddleCount] = useState(0);

  const [riddle, setRiddle] = useState({});

  const inputRef = useRef();

  async function checkRiddleCount(){
    try {
      const response = await fetch(
        "http://localhost/guess-movie-emoji/api/riddleApi.php?count=true"
      );

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

      if (data.finished) {
        const lastId = ids[ids.length - 1];
        setSeenIds([]);
        fetchRiddle([lastId]);
        return;
      }

      setRiddle(data.riddle);
      setSeenIds([...ids, data.riddle.id]);
      console.log(data.riddle);
    } catch (error) {
      console.error("Error fetching riddle:", error);
    }
  }

  function checkAnswer(userAnswer) {
    if (riddle.title && userAnswer.toLowerCase() === riddle.title.toLowerCase()) {
      setWin(true);
      setMode("answer");
      inputRef.current.value = "";
    }
    else {
      inputRef.current.classList.add("wrongAnswer");

      setTimeout(() => {
        inputRef.current.classList.remove("wrongAnswer");
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
      <h1 className="textCenter"><span className="thinText">Guess</span> the movie<br/><span className="thinText">based on</span> emojis</h1>
      <hr />
        {riddleCount > 0 ?
          (
            <>
              <section>
                <h1 className="textCenter">{riddle.answer}</h1>
                {mode === "play" ? (
                  <div className="dRowCenter">
                    <input type="text" placeholder="Type your answer here..."  ref={inputRef} />
                    <button className="primary-button" onClick={() => checkAnswer(inputRef.current.value)}>Check</button>
                  </div>
                ) : (
                  <div className="textCenter">
                    <h2 className="riddleTitle"><span className="thinText">The title:</span> {riddle.title}</h2>
                    {win ? <p>You got it!</p> : <p>Maybe next time!</p>}
                  </div>
                )}
              </section>
              <hr />
              <section className="dRowEnd">
                  <button className="primary-button" onClick={() => {
                      setWin(false);
                      setMode(mode === "play" ? "answer" : "play")
                    }}>
                    {mode === "play" ? "Show answer" : "Hide answer"}
                  </button>
                  {riddleCount > 1 
                    && <button className="primary-button" onClick={() => {setWin(false); setMode("play"); fetchRiddle(seenIds);}}>Next riddle</button>
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