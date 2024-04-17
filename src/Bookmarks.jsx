import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import CardDetails from "./CardDetails";
import { supabase } from "./supabaseClient";

function Bookmarks() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchBookmarkedCards();
  }, [user]);

  const fetchBookmarkedCards = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data: bookmarkData, error } = await supabase
      .from("bookmarks")
      .select("card_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching bookmarks:", error);
      setIsLoading(false);
      return;
    }

    const cardPromises = bookmarkData.map((bookmark) =>
      fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${bookmark.card_id}`
      )
        .then((response) => response.json())
        .then((data) => data.data[0])
    );

    Promise.all(cardPromises)
      .then((fetchedCards) => {
        setCards(fetchedCards.filter((card) => card));
      })
      .catch((error) => {
        console.error("Failed to fetch card details:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleRemoveBookmark = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : cards.length > 0 ? (
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
      ) : (
        <p className="text-center">There are no bookmarked cards currently.</p>
      )}
      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          user={user}
          onRemoveBookmark={handleRemoveBookmark}
        />
      )}
    </div>
  );
}

export default Bookmarks;
