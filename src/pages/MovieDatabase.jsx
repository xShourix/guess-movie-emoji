import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Popup from "../components/Popup";
import EditPopup from "../components/EditPopup";

export default function MovieDatabase() {

  const [popupText, setPopupText] = useState("");
  const [popupEditText, setPopupEditText] = useState("");

  const [titleSearch, setTitleSearch] = useState("");
  const [movies, setMovies] = useState([]);
  
  const [editMovieId, setEditMovieId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  async function handleEdit(movieId, movieAnswer, movieTitle) {
    setEditMovieId(movieId);
    setEditTitle(movieTitle);
    setEditAnswer(movieAnswer);
    setPopupEditText("Edit the riddle and click save to apply changes");
  }

  async function handleUpdate() {
    if (editTitle === "" || editAnswer === "") {
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
            id: editMovieId,
            answer: editAnswer,
            title: editTitle,
          }),
        }
      );

      if (!response.ok) {
        setPopupText("Failed to edit riddle");
        return;
      }
      await fetchMovies();

      setPopupText("Riddle edited successfully!");
    } catch (error) {
      console.error(error);
      setPopupText("Error editting riddle");
    }
  }

  async function handleDelete(movieId) {
    try {
      const response = await fetch("http://localhost/guess-movie-emoji/api/riddleApi.php",{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: movieId,
          }),
        }
      );

      if (!response.ok) {
        setPopupText("Failed to delete riddle");
        return;
      }
      await fetchMovies();
    } catch (error) {
      console.error(error);
      setPopupText("Error deleting riddle");
    }
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
      {popupEditText && <EditPopup popupEditText={popupEditText} setPopupEditText={setPopupEditText} editTitle={editTitle} setEditTitle={setEditTitle} editAnswer={editAnswer} setEditAnswer={setEditAnswer} setEditMovieId={setEditMovieId} handleUpdate={handleUpdate} />}
      {popupText && <Popup popupText={popupText} setPopupText={setPopupText} />}
      <section className="dRowSpacebetween">
        <h1><span className="thinText">Riddle</span> database</h1>
        <Link to="/add" className="button">Add new</Link>
      </section>
      <section className="movieDatabase">
        <input className="search-input" type="text" placeholder="Search..." value={titleSearch} onChange={e => setTitleSearch(e.target.value)} />
        <div className="movie-results">
          {(movies && (movies.length === 0 || movies .filter(movie => movie.title.toLowerCase().includes(titleSearch.toLowerCase())).length === 0))
            ? (
              <p>No riddles found.</p>
            )
            : (movies
              .filter(movie => movie.title.toLowerCase().includes(titleSearch.toLowerCase()))
              .map(movie => (
                <div key={movie.id} className="search-item">
                  <div className="item-menu-container">
                    <FontAwesomeIcon className="item-menu-icon" icon={faEllipsisVertical} />
                    <ul className="item-menu">
                      <li onClick={() => handleEdit(movie.id, movie.answer, movie.title)}>Edit</li>
                      <li onClick={() => handleDelete(movie.id)}>Delete</li>
                    </ul>
                  </div>
                  <span className="answer">{movie.answer}</span>
                  <h3>{movie.title}</h3>
                </div>
              )))
            }
        </div>
      </section>
    </main>
  );
}