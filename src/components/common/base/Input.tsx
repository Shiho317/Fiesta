import React from "react";

import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProp<TFormValues extends FieldValues> = {
  type: string;
  label: string;
  name: string | Path<TFormValues>;
  placeholder?: string;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
  list?: string;
  register?: UseFormRegister<TFormValues>;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = <TFormValues extends Record<string, unknown>>(
  props: InputProp<TFormValues>
) => {
  const {
    type,
    label,
    name,
    placeholder,
    className,
    required,
    readOnly,
    children,
    list,
    register,
    onChangeHandler,
  } = props;

  return (
    <div className={className}>
      <label htmlFor={name} className="block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        list={list ?? ""}
        placeholder={placeholder}
        required={required ?? false}
        readOnly={readOnly ?? false}
        className="w-full p-3 text-center text-black outline-none"
        onChange={onChangeHandler}
        {...(register && register(name as Path<TFormValues>))}
      />
      {children}
    </div>
  );
};

export default Input;
