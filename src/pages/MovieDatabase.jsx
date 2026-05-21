import { Link } from "react-router-dom";

export default function MovieDatabase() {
  return (
    <main>
      <div className="dRowSpacebetween">
        <h1><span className="thinText">Riddle</span> database</h1>
        <Link to="/add" className="button">Add new</Link>
      </div>
    </main>
  );
}