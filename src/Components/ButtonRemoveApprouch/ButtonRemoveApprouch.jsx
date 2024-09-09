import React from "react";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import { Toast } from 'primereact/toast';
import cl from "./ButtonRemoveApprouch.module.css";
import MyModal from "../../Components/MyModal/MyModal";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";


function ButtonRemoveApprouch({ idApprouch, exerciseApproaches, setExerciseApproaches, exerciseTitle }) {
    const token = Cookies.get("token");
    const [modal, setModal] = useState(false);
    const toast = useRef(null);

    async function removeApprouch() {
        try {
            const response = await SportApp.delete_approuch(idApprouch, token);
            setExerciseApproaches(exerciseApproaches.filter((a) => a.id !== response.data.id));
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: `Подход удален для упражнения "${exerciseTitle}"`, life: 3000 });
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: `Не удалось удалить подход для упражнения "${exerciseTitle}"`, life: 3000 });
        } finally {
            setModal(false);
        }
    }

    return (<>
        <Toast ref={toast} position="top-center"></Toast>
        <MyModal visible={modal} setVisible={setModal}><ConfirmDialog setModal={setModal} dialog="Удалить подход?" confirmAction={removeApprouch} /></MyModal>
        <span className={cl.removeApprouch} onClick={() => setModal(true)}>x</span>
    </>
    )
}

export default ButtonRemoveApprouch;