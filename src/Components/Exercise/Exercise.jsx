import React from "react";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import { Toast } from 'primereact/toast';
import cl from "./Exercise.module.css"
import TrashButton from "../../Components/TrashButton/TrashButton";
import { sum, truncateString } from "../../utils";
import ButtonRemoveApprouch from "../ButtonRemoveApprouch/ButtonRemoveApprouch";
import MyModal from "../../Components/MyModal/MyModal";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";

function Exercise({ trExercise }) {
    const token = Cookies.get("token");
    const [modal, setModal] = useState(false);
    const [collapsed, setCollapsed] = useState(false); // Добавляем состояние для сворачивания
    const toast = useRef(null);
    const approachAmmount = useRef(null);
    const approachWeight = useRef(null);
    const [exerciseApproaches, setExerciseApproaches] = useState(trExercise.approaches);
    const [visible, setVisible] = useState(true);

    async function removeExercise(id) {
        try {
            await SportApp.delete_exercise(id, token);
            setVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Упражнение удалено', life: 3000 });
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить упражнение', life: 3000 });
            console.error(e);
        } finally {
            setModal(false);
        }
    }

    function createDialogQuestion(question, obj) {
        return `${question} "${obj}"?`;
    }

    async function createApprouch() {
        if (!approachAmmount.current.value) {
            toast.current.show({ severity: 'info', summary: 'Внимание', detail: 'Нельзя добавить подход без повторений', life: 3000 });
            return;
        }

        try {
            const response = await SportApp.create_approuch({
                exercise_id: trExercise.id,
                ammount: approachAmmount.current.value,
                weight: approachWeight.current.value
            }, token);
            setExerciseApproaches([...exerciseApproaches, response.data]);
            approachAmmount.current.value = "";
            approachWeight.current.value = "";
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить подход', life: 3000 });
            console.error(e);
        }
    }

    return (
        <>
            <Toast ref={toast} position="top-center" />
            {visible && (
                <div className={cl.container}>
                    <MyModal visible={modal} setVisible={setModal}>
                        <ConfirmDialog
                            setModal={setModal}
                            dialog={createDialogQuestion('Удалить упражнение', trExercise.title)}
                            confirmAction={() => removeExercise(trExercise.id)}
                        />
                    </MyModal>
                    <div className={cl.header}>
                        <span onClick={() => setCollapsed(!collapsed)} className={cl.exerciseTitle}>{truncateString(trExercise.title, 55)}  <button className={cl.toggleButton} >
                            {collapsed ? '▶️' : '▼️'}
                        </button></span>

                        <span className={cl.removeButton}>
                            <TrashButton onClick={() => setModal(true)} />
                        </span>

                    </div>
                    <div className={`${cl.cardContainer} ${collapsed ? cl.collapsed : cl.expanded}`}>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Подход</th>
                                    <th scope="col">Количество</th>
                                    <th scope="col">Вес</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    exerciseApproaches.map((approach, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{truncateString(approach.ammount)}</td>
                                            <td>{truncateString(approach.weight)}</td>
                                            <td>
                                                <ButtonRemoveApprouch
                                                    exerciseTitle={trExercise.title}
                                                    idApprouch={approach.id}
                                                    setExerciseApproaches={setExerciseApproaches}
                                                    exerciseApproaches={exerciseApproaches}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }


                            </tbody>
                        </table>
                    </div>
                    <p className={cl.summary}>
                        Выполнено <span className={cl.sum}>{sum(exerciseApproaches)}</span> повторений
                    </p>
                    <div className={cl.inputGroup}>
                        {/* Поле для ввода количества повторений */}
                        <input
                            ref={approachAmmount}
                            type="text"
                            className={cl.input}
                            placeholder="Количество повторений"
                        />
                        {/* Поле для ввода веса (не привязано к ref) */}
                        <input
                            ref={approachWeight}
                            type="text"
                            className={cl.input}
                            placeholder="Вес"
                        />

                    </div>
                    <div className={cl.inputGroup}>
                        <button
                            className={cl.saveButton}
                            onClick={createApprouch}
                            type="button">
                            Записать
                        </button></div>

                </div>
            )}
        </>
    );
}

export default Exercise;
