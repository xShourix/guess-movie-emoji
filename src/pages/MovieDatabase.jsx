import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MovieDatabase() {

  const [titleSearch, setTitleSearch] = useState("");
  const [movies, setMovies] = useState([]);

  async function addPopup(popupText) {
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = "<button onclick={{document.getElementById('popup').remove()}}>X</button><p>"+popupText+"</p>";
    document.body.appendChild(popup);
  }

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
        addPopup("Failed to fetch riddles");
        return;
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
      addPopup("Error fetching riddles");
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
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