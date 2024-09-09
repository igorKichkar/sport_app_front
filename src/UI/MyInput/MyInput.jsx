import React from "react";

function MyInput({ placeholder, value, setValue, onBlur, label = null }) {
  return (
    <div className="form-group">
      {label ? <label for="exampleInputEmail1">{label}</label> : ""}
      <input
        onBlur={onBlur}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="form-control"
        placeholder={placeholder}></input>
    </div>
  )
}

export default MyInput;