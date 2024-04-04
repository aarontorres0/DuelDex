import React, { useEffect } from "react";

function CardDetails({ card, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl">
        <div className="flex">
          <figure className="flex-none w-1/2 px-5 pt-5">
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
            {card.level && (
              <p className="py-2">
                <strong>Level:</strong> {card.level}
              </p>
            )}
            {card.atk && (
              <p className="py-2">
                <strong>Attack:</strong> {card.atk}
              </p>
            )}
            {card.def && (
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
              <p className="py-2">
                <strong>Description:</strong> {card.desc}
              </p>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-error text-white" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;
