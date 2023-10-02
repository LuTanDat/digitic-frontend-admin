import React from "react";

const CustomInput = (props) => {
  // name, val, onChng, onBlr
  const { type, label, i_id, i_class } = props;
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className={`form-control ${i_class}`}
        id={i_id}
        placeholder={label}
      // name={name}
      // value={val}
      // onChange={onChng}
      // onBlur={onBlr}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

export default CustomInput;