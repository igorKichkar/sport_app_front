import React from "react";
import cl from "./ConfirmDialog.module.css";

function ConfirmDialog(props) {
    return (
        <div className={cl.dialogContainer}>
            <p className={cl.dialogText}>{props.dialog}</p>
            <div className={cl.buttonContainer}>
                <button className={cl.cancelButton} onClick={() => props.setModal(false)}>
                    Отмена
                </button>
                <button className={cl.confirmButton} onClick={props.confirmAction}>
                    Да
                </button>
            </div>
        </div>
    );
}

export default ConfirmDialog;
