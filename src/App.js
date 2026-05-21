import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import MovieDatabase from "./pages/MovieDatabase";
import AddQuiz from "./pages/AddQuiz";

function App() {
  return (
    <div>
      {/* NAVIGATION */}
      <nav>
        <Link to="/">Start</Link>
        <Link to="/movie-database">Movie Database</Link>
      </nav>
      
      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie-database" element={<MovieDatabase />} />
        <Route path="/add" element={<AddQuiz />} />
      </Routes>
    </div>
  );
}

export default App;