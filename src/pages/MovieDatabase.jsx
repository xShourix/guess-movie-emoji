import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Popup from "../components/Popup";

export default function MovieDatabase() {

  const [titleSearch, setTitleSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [popupText, setPopupText] = useState("");

  async function fetchMovies() {
    try {
      const response = await fetch("http://localhost/guess-movie-emoji/api/riddleApi.php",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        setPopupText("Failed to fetch riddles");
        return;
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
      setPopupText("Error fetching riddles");
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      {popupText && <Popup popupText={popupText} setPopupText={setPopupText} />}
      <section className="dRowSpacebetween">
        <h1><span className="thinText">Riddle</span> database</h1>
        <Link to="/add" className="button">Add new</Link>
      </section>
      <section className="movieDatabase">
        <input className="search-input" type="text" placeholder="Search..." value={titleSearch} onChange={e => setTitleSearch(e.target.value)} />
        <div className="movie-results">
          {movies
            .filter(movie => movie.title.toLowerCase().includes(titleSearch.toLowerCase()))
            .map(movie => (
              <div key={movie.id} className="search-item">
                <span className="answer">{movie.answer}</span>
                <h3>{movie.title}</h3>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}