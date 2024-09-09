import React, { useState } from "react";
import { date_convertor } from "../../utils";
import TrashButton from "../TrashButton/TrashButton";
import MyModal from "../MyModal/MyModal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SportApp from "../../API/SportApp";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./TraningItem.module.css"; // Импорт модульных стилей
import { AuthImage } from "react-auth-image";
import { BASE_URL } from "../../config";

export function TraningItem({ traning, loadUser }) {
    const image = traning.images[0];
    const token = Cookies.get("token");
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    async function confirmAction(id) {
        try {
            await SportApp.remove_item(id, token);
            setModal(false);
            loadUser();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.cardWrapper}>
            <MyModal visible={modal} setVisible={setModal}>
                <ConfirmDialog
                    setModal={setModal}
                    dialog="Удалить тренировку?"
                    confirmAction={() => confirmAction(traning.id)}
                />
            </MyModal>
            <span className={styles.trashButton}>
                <TrashButton onClick={() => setModal(true)} />
            </span>
            <div className={styles.card} onClick={() => navigate(`traning/${traning.id}`)}>
                <div className={styles.cardHeader}>
                    <div className={styles.date}>
                        {date_convertor(traning.created_date)}
                    </div>
                </div>
                <p className={styles.title}>{traning.title}</p>

                {
                    image ? <AuthImage
                        className={styles.imgThumbnail}
                        src={`${BASE_URL}/images/${image.title}`}
                        token={token}
                        errorCallback={() => { }}
                    /> : <img
                        className={styles.imgThumbnail}
                        src="/placeholder-image.jpg"
                    />
                }

            </div>
        </div>
    );
}
