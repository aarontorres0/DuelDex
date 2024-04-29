import React from "react";

const CardSearch = ({ onSearchTextChange, placeholder, searchText }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearchTextChange(event.target.value);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <label className="relative w-full max-w-sm">
        <input
          type="search"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input input-bordered input-primary w-full max-w-sm"
        />
        {searchText.length > 0 && (
          <button
            onClick={() => onSearchTextChange("")}
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
