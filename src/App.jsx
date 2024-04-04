import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchCards = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setCards(data.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    }
  };

  useEffect(() => {
    const fetchRandomCards = async () => {
      let fetchedCards = [];
      for (let i = 0; i < 8; i++) {
        try {
          const response = await fetch(
            "https://db.ygoprodeck.com/api/v7/randomcard.php"
          );
          const data = await response.json();
          fetchedCards.push(data);
        } catch (error) {
          console.error("Error fetching random card:", error);
        }
      }
      setCards(fetchedCards);
    };

    fetchRandomCards();
  }, []);

  return (
    <div className="px-4 py-2">
      <input
        type="text"
        placeholder="Search for a card"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4"
      />

      <button
        onClick={searchCards}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-shrink-0 mr-4"
            style={{ width: "240px" }}
          >
            <img
              src={card.card_images[0].image_url}
              alt={card.name}
              style={{ width: "240px", height: "320px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
