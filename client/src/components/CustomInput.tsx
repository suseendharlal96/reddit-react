import React from "react";

import classNames from "classnames";

interface CustomInputProps {
  value: string;
  className: string;
  setValue: (str: string) => void;
  error: string | undefined;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  className,
  setValue,
  error,
}) => {
  return (
    <div className={className}>
      <input
        type="email"
        name="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={classNames(
          "w-full p-3 transition duration-200 bg-gray-200 border border-gray-300 rounded outline-none hover:bg-white focus:bg-white",
          { "border-red-500": error }
        )}
        placeholder="Email"
      />
      {error && <small className="font-medium text-red-600">{error}</small>}
    </div>
  );
};

export default CustomInput;
