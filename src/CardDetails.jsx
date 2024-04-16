import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function CardDetails({ card, onClose, onRemoveBookmark, onRemoveCard, user }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInDeck, setIsInDeck] = useState(false);

  const descriptionLines = card.desc
    ? card.desc.split("●").filter((line) => line.trim() !== "")
    : [];

  useEffect(() => {
    checkBookmarkStatus();
    checkDeckStatus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [card.id]);

  const handleModalContentClick = (e) => e.stopPropagation();

  const checkBookmarkStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("card_id", card.id);
    setIsBookmarked(data.length > 0);
  };

  const toggleBookmark = async () => {
    if (!user) return;

    if (isBookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ user_id: user.id, card_id: card.id });
      if (!error) {
        setIsBookmarked(false);
        onRemoveBookmark(card.id);
      } else {
        console.error("Error removing bookmark:", error);
      }
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: user.id, card_id: card.id }]);
      if (!error) {
        setIsBookmarked(true);
      } else {
        console.error("Error adding bookmark:", error);
      }
    }
  };

  const checkDeckStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("deck")
      .select("*")
      .eq("user_id", user.id)
      .eq("card_id", card.id);
    setIsInDeck(data.length > 0);
  };

  const toggleDeck = async () => {
    if (!user) return;

    if (isInDeck) {
      const { error } = await supabase
        .from("deck")
        .delete()
        .match({ user_id: user.id, card_id: card.id });
      if (!error) {
        setIsInDeck(false);
        onRemoveCard(card.id);
      } else {
        console.error("Error removing card from deck:", error);
      }
    } else {
      const { error } = await supabase
        .from("deck")
        .insert([{ user_id: user.id, card_id: card.id }]);
      if (!error) {
        setIsInDeck(true);
      } else {
        console.error("Error adding card to deck:", error);
      }
    }
  };

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box w-11/12 max-w-4xl"
        onClick={handleModalContentClick}
      >
        <div className="flex flex-col md:flex-row">
          <figure className="md:flex-none w-full md:w-1/2 px-5 pt-5">
            <img
              src={card.card_images[0].image_url}
              alt={card.name}
              className="rounded-xl"
            />
          </figure>

          <div className="flex-grow px-5 py-4">
            <h3 className="font-bold text-xl">{card.name}</h3>
            {card.type && (
              <p className="py-2">
                <strong>Type:</strong> {card.type}
              </p>
            )}
            {card.attribute && (
              <p className="py-2">
                <strong>Attribute:</strong> {card.attribute}
              </p>
            )}
            {card.race && (
              <p className="py-2">
                <strong>Race:</strong> {card.race}
              </p>
            )}
            {typeof card.level !== "undefined" && (
              <p className="py-2">
                <strong>Level:</strong> {card.level}
              </p>
            )}
            {typeof card.atk !== "undefined" && (
              <p className="py-2">
                <strong>Attack:</strong> {card.atk}
              </p>
            )}
            {typeof card.def !== "undefined" && (
              <p className="py-2">
                <strong>Defense:</strong> {card.def}
              </p>
            )}
            {card.archetype && (
              <p className="py-2">
                <strong>Archetype:</strong> {card.archetype}
              </p>
            )}
            {card.desc && (
              <div className="py-2">
                <strong>Description:</strong>
                {descriptionLines.map((line, index) => (
                  <p key={index}>{index > 0 ? "● " + line : line}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-action flex flex-wrap">
          {user && (
            <>
              <button
                className={`btn ${
                  isBookmarked
                    ? "btn-outline btn-primary text-white"
                    : "btn-primary"
                } my-2`}
                onClick={toggleBookmark}
              >
                {isBookmarked ? "Remove Bookmark" : "Bookmark"}
              </button>
              <button
                className={`btn ${
                  isInDeck ? "btn-outline btn-info" : "btn-info text-white"
                } my-2`}
                onClick={toggleDeck}
              >
                {isInDeck ? "Remove from Deck" : "Add to Deck"}
              </button>
            </>
          )}
          <button className="btn btn-error text-white my-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;
