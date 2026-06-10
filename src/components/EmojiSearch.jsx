import { useState, useEffect } from "react";

export default function EmojiSearch({ setAnswer }) {
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
        } catch (error) {
            console.error("Error fetching emoji:", error);
        }
    }

    function htmlCodeToEmoji(htmlCode) {
        return htmlCode
            .map(code => {
                const emojiNum = Number(code.replace(/[&#;]/g, ""));
                return String.fromCodePoint(emojiNum);
            })
            .join("");
    }

    useEffect(() => {
        fetchEmojis();
    }, []);

    return (
        <section>
            <div className="w100">
                <h3>Click emoji to add it</h3>
                <input className="search-input" type="text" placeholder="Search for an emoji..." value={textEmojiSearch} onChange={e => setTextEmojiSearch(e.target.value)} />
            </div>
            <div className="emoji-results">
                {emojis
                    .filter((emoji) => emoji.name.toLowerCase().includes(textEmojiSearch.toLowerCase()))
                    .map((emoji) => (

                    <div key={emoji.unicode} className="search-item interactive" onClick={() => setAnswer(prev => prev + htmlCodeToEmoji(emoji.htmlCode))}>
                        <span className="emoji">
                            {htmlCodeToEmoji(emoji.htmlCode)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}