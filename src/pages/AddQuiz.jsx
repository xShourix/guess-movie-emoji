import { useState, useEffect } from "react";
import EmojiSearch from "../components/EmojiSearch";

export default function AddQuiz() {
  return (
    <main>
      <h1><span className="thinText">Add</span> new riddle</h1>
      <EmojiSearch />
    </main>
  );
}