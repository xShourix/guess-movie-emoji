import { useState, useEffect } from "react";

export default function EmojiSearch({ setAnswer }) {
    const [textEmojiSearch, setTextEmojiSearch] = useState("");
    const [emojis, setEmojis] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    async function fetchEmojis() {
        try {
            const response = await fetch("https://emojihub.yurace.pro/api/all");
            if (!response.ok) {
                throw new Error("Could not fetch emojis");
            }
            const data = await response.json();
            setEmojis(data);
        } catch (error) {
            console.error("Error fetching emojis:", error);
        }
    }
    async function fetchCategories() {
        try {
            const response = await fetch("https://emojihub.yurace.pro/api/categories");
            if (!response.ok) {
                throw new Error("Could not fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
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
        fetchCategories();
    }, []);

    return (
        <section>
            <h3>Click emoji to add it</h3>
            <div className="dRow">
                <button className="buttonCategories" onClick={() => setSelectedCategory("all")}>All</button>
                {categories
                    .map((category) => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className="buttonCategories">
                        {category}
                    </button>
                ))}
            </div>
            <input className="" type="text" placeholder="Search for an emoji..." value={textEmojiSearch} onChange={e => setTextEmojiSearch(e.target.value)} />
            <div className="emojiResults">
                {emojis
                    .filter((emoji) => (
                        (
                            (emoji.name.toLowerCase().includes(textEmojiSearch.toLowerCase())) 
                            || (emoji.group.toLowerCase().includes(textEmojiSearch.toLowerCase()))
                        )
                        && (selectedCategory === "all" || emoji.category.toLowerCase() === selectedCategory.toLowerCase())
                    ))
                    .map((emoji) => (
                    <div key={emoji.unicode} className="searchItem interactive" onClick={() => setAnswer(prev => prev + htmlCodeToEmoji(emoji.htmlCode))}>
                        <span className="emoji">
                            {htmlCodeToEmoji(emoji.htmlCode)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}