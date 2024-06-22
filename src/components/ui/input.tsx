import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return <input className="border p-2 rounded-md" {...props} />;
};

export default Input;
