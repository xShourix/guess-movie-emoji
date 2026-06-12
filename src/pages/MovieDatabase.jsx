import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Popup from "../components/Popup";

export default function MovieDatabase() {

  const [popupText, setPopupText] = useState("");

  const [movies, setMovies] = useState([]);
  
  const [titleSearch, setTitleSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  async function deleteRiddle(movieId) {
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
      const response = await fetch(`http://localhost/guess-movie-emoji/api/riddleApi.php?page=${currentPage}&limit=${itemsPerPage}&search=${titleSearch}`,{
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
      setMovies(data.riddles);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
      setPopupText("Error fetching riddles");
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [titleSearch, currentPage]);

  return (
    <main>
      {popupText && <Popup popupText={popupText} setPopupText={setPopupText} />}
      <div className="dRowSpacebetween">
        <h1><span className="thinText">Riddle</span> database</h1>
        <Link to="/add" className="button">Add new</Link>
      </div>
      <hr />
      <section className="movieDatabase">
        <input type="text" value={titleSearch} placeholder="Search..." 
          onChange={e => {
            setTitleSearch(e.target.value);
            setCurrentPage(1);
          }} 
        />
        <div className="movieResults">
          {(movies && movies.length === 0)
            ? (
              <p>No riddles found.</p>
            )
            : (movies
              .map(movie => (
                <div key={movie.id} className="searchItem">
                  <div className="itemMenuContainer">
                    <FontAwesomeIcon className="itemMenuIcon" icon={faEllipsisVertical} />
                    <ul className="itemMenu">
                      <li><Link to={`/edit/${movie.id}`}className="thinText">Edit</Link></li>
                      <li onClick={() => deleteRiddle(movie.id)}><span className="thinText">Delete</span></li>
                    </ul>
                  </div>
                  <span className="answer">{movie.answer}</span>
                  <h3>{movie.title}</h3>
                </div>
              )))
            }
        </div>
        <div className="dRowSpacebetween">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <p>
            {currentPage > 2 && <span>1 </span>}
            {currentPage > 3 && <span>... </span>}
            {currentPage > 1 && <span>{currentPage - 1} </span>}

            <b>{currentPage}</b>

            {currentPage < totalPages && <span> {currentPage + 1}</span>}
            {currentPage < totalPages - 2 && <span> ...</span>}
            {currentPage < totalPages - 1 && <span> {totalPages}</span>}
          </p>

          <button disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}