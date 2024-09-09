import React from "react";

function MyTextarea({ placeholder, value, setValue, onBlur, rows = 3, label = null }) {
    return (
        <div className="form-group">
            {label ?
                <label>{label}</label>
                : ""
            }
            <textarea onBlur={onBlur} onChange={(e)=>setValue(e.target.value)} placeholder={placeholder} className="form-control" rows={rows} value={value}>{value}</textarea>
        </div>
    )
}

export default MyTextarea