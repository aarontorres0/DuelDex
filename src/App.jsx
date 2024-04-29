import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import CardDetails from "./CardDetails";
import "./index.css";

const App = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchCards = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setFeedbackMessage("");
      return;
    }

    try {
      const response = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(
          trimmedQuery
        )}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setCards(data.data);
        setFeedbackMessage("");
        if (data.data.length === 1) {
          setSearchFeedback(`Found ${data.data.length} card`);
        } else {
          setSearchFeedback(`Found ${data.data.length} cards`);
        }
      } else {
        setCards([]);
        setSearchFeedback("");
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
        <label className="relative w-full max-w-sm">
          <input
            type="search"
            placeholder="Search for a card"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered input-primary w-full max-w-sm"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 010 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 111.414-1.414L10 8.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </label>
        <button onClick={searchCards} className="btn btn-primary ml-2">
          Search
        </button>
      </div>
      {searchFeedback && (
        <p className="text-center text-xs text-gray-500 m-4">
          {searchFeedback}
        </p>
      )}
      {feedbackMessage && (
        <div className="text-center m-4">{feedbackMessage}</div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loading loading-spinner loading-md text-info"></div>
          <p className="ml-2">Loading cards...</p>
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
};

export default App;
