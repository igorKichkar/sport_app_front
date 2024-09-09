import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import { Toast } from 'primereact/toast';
import MyButton from "../../UI/MyButton/MyButton";
import { useRef, useState, useEffect } from "react";
import styles from "./TitleAndDescription.module.css";

function TitleAndDescription({ trId, trTitle, trDescription }) {
    const token = Cookies.get("token");

    const toast = useRef(null);
    const traningDescription = useRef(null);
    const traningTitle = useRef(null);
    const [traningId, setTraningId] = useState(null);

    useEffect(() => {
        setTraningId(trId);
        traningTitle.current.value = trTitle;
        traningDescription.current.value = trDescription;
    }, [trId]);

    async function putTraning() {
        try {
            await SportApp.update_item(traningId, {
                title: traningTitle.current.value,
                description: traningDescription.current.value
            }, token);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изменения сохранены', life: 3000 });
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить', life: 3000 });
            console.error(e);
        }
    }

    return (
        <>
            <Toast ref={toast} position="top-center" />
            <div className={styles.container}>
                <div className={styles.inputGroup}>
                    <input
                        ref={traningTitle}
                        className={styles.titleInput}
                        placeholder="Название"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <textarea
                        ref={traningDescription}
                        placeholder="Описание"
                        className={styles.descriptionInput}
                        rows="3"
                    />
                </div>
                <MyButton title="Сохранить" onClick={putTraning} className={styles.saveButton} />
            </div>
        </>
    );
}

export default TitleAndDescription;
