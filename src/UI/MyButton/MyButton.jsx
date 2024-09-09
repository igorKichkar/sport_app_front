import React from "react";

function MyButton({title, onClick, style="btn btn-secondary"}){
    return(<button onClick={onClick} type="button" className={style}>{title}</button>)
}

export default MyButton;