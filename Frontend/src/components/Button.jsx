import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium 
        bg-blue-600 text-white 
        hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
