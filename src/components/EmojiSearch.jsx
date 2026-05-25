import { useState, useEffect } from "react";

export default function EmojiSearch() {
    const [textEmojiSearch, setTextEmojiSearch] = useState("");
    const [emojis, setEmojis] = useState([]);

    async function fetchEmojis() {
        try {
            const response = await fetch("https://emojihub.yurace.pro/api/all");
            if (!response.ok) {
                throw new Error("Could not fetch emojis");
            }
            const data = await response.json();
            setEmojis(data);
            console.log("Fetched emojis:", data);
        } catch (error) {
            console.error("Error fetching emoji:", error);
        }
    }

    useEffect(() => {
        fetchEmojis();
    }, []);

    return (
        <section>
            <input className="search-input" type="text" placeholder="Search for an emoji..." value={textEmojiSearch} onChange={e => setTextEmojiSearch(e.target.value)} />
            <div className="emoji-results">
                {emojis
                    .filter((emoji) => emoji.name.toLowerCase().includes(textEmojiSearch.toLowerCase()))
                    .map((emoji) => (

                    <div key={emoji.unicode} className="search-item">
                        <span className="emoji">
                            {emoji.htmlCode
                                .map(code => {
                                    const emojiNum = Number(code.replace(/[&#;]/g, ""));
                                    return String.fromCodePoint(emojiNum);
                                })
                                .join("")
                            }
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}