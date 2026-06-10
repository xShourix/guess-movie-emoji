import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import MovieDatabase from "./pages/MovieDatabase";
import HandleRiddle from "./pages/HandleRiddle";

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
        <Route path="/add" element={<HandleRiddle />} />
        <Route path="/edit/:id" element={<HandleRiddle />} />
      </Routes>
    </div>
  );
}

export default App;