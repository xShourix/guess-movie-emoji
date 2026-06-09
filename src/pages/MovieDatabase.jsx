import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MovieDatabase() {

  const [titleSearch, setTitleSearch] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("http://localhost:3000/movies");
        if (!response.ok) {
          throw new Error("Could not fetch movies");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
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
        <div className="movieResults">
          {movies
            .filter(movie => movie.title.toLowerCase().includes(titleSearch.toLowerCase()))
            .map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="search-item">
                <h2>{movie.title}</h2>
                <p>{movie.year}</p>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}