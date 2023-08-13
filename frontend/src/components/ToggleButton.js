import React from "react";

const ToggleButton = () => {
  return (
    <label
      htmlFor="drawer"
      className="text-white border p-2 rounded-md border-opacity-60 border-gray-400 flex lg:hidden mb-4 w-10"
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
    </label>
  );
};

export default ToggleButton;
