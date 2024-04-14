import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import CardDetails from "./CardDetails";
import "./index.css";

function App() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchCards = async () => {
    if (!searchQuery) {
      setFeedbackMessage("");
      return;
    }

    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setCards(data.data);
        setFeedbackMessage("");
      } else {
        setCards([]);
        setFeedbackMessage(
          "No cards found matching your search. Please check the spelling or try a different name."
        );
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
      setFeedbackMessage("Failed to fetch cards. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCards();
    }
  };

  const fetchRandomCards = async () => {
    setIsLoading(true);
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
    setFeedbackMessage("");
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomCards();
  }, []);

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-center my-4">
        <input
          type="search"
          placeholder="Search for a card"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered input-primary w-full max-w-xs"
        />
        <button onClick={searchCards} className="btn btn-primary ml-2">
          Search
        </button>
      </div>
      {feedbackMessage && <div className="m-4">{feedbackMessage}</div>}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
          <p>Loading cards...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-base-100 cursor-pointer"
              onClick={() => setSelectedCard(card)}
            >
              <figure className="bg-white">
                <img
                  src={card.card_images[0].image_url}
                  alt={card.name}
                  className="w-full"
                />
              </figure>
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          user={user}
        />
      )}
    </div>
  );
}

export default App;
