import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import CardDetails from "./CardDetails";
import CardSearch from "./CardSearch";
import { supabase } from "./supabaseClient";

function Deck() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchDeckCards();
  }, [user]);

  useEffect(() => {
    applySearch();
  }, [cards, searchText]);

  const applySearch = () => {
    const filtered = cards.filter((card) =>
      card.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    applySearch();
  };

  const fetchDeckCards = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data: deckData, error } = await supabase
      .from("deck")
      .select("card_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching deck cards:", error);
      setIsLoading(false);
      return;
    }

    const cardPromises = deckData.map((card) =>
      fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.card_id}`)
        .then((response) => response.json())
        .then((data) => data.data[0])
    );

    Promise.all(cardPromises)
      .then((fetchedCards) => {
        setCards(fetchedCards.filter((card) => card));
        setFilteredCards(fetchedCards.filter((card) => card));
      })
      .catch((error) => {
        console.error("Failed to fetch card details:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleRemoveCard = (cardId) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };

  const handleAddCard = (newCard) => {
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <CardSearch
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
      />
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCards.map((card, index) => (
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
      ) : (
        <p className="text-center">
          No cards in your deck match your search or you do not have any cards
          in your deck.
        </p>
      )}
      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          user={user}
          onRemoveCard={handleRemoveCard}
          onAddCard={handleAddCard}
        />
      )}
    </div>
  );
}

export default Deck;
