import React from "react";

const CardSearch = ({ onSearchTextChange, placeholder, searchText }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearchTextChange(event.target.value);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <input
        type="search"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input input-bordered input-primary w-full max-w-xs"
      />
      <button
        onClick={() => onSearchTextChange(searchText)}
        className="btn btn-primary ml-2"
      >
        Search
      </button>
    </div>
  );
};

export default CardSearch;
