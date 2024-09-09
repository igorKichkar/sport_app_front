import React from "react";

function LoadButton() {
    return (
        <button style={{ "width": "125px" }} className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Загрузка...
        </button>
    );
}

export default LoadButton;