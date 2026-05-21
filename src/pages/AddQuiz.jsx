import { useState } from "react";

export default function AddQuiz() {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();


    setMessage("Quiz added! 🎉");
    setTitle("");
    setEmoji("");
  }

  return (
    <main>
      <h1><span className="thinText">Add</span> new riddle</h1>
    </main>
  );
}