import React from "react";

type ButtonProp = {
  content: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

const Button = (props: ButtonProp) => {
  const { content, className, type, onClick, disabled } = props;
  return (
    <button
      type={type ?? "button"}
      className={`ease bg-fiesta-200 px-4 py-2 text-lg tracking-wider transition-colors duration-200 hover:bg-fiesta-100 ${
        className ?? ""
      }`}
      disabled={disabled ?? false}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
