import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import { Toast } from 'primereact/toast';
import cl from "./ListExercises.module.css";
import Exercise from "../Exercise/Exercise";
import { useRef, useState, useEffect } from "react";


function ListExercises({ trExercises, traningId }) {
    const token = Cookies.get("token");
    const toast = useRef(null);
    const [exercises, setExercises] = useState([]);
    const newExercise = useRef(null);
    const [exerciseLoader, setExerciseLoader] = useState(false);

    useEffect(() => {
        setExercises(trExercises);
    }, [trExercises]);

    async function createExercise() {
        if (!newExercise.current.value) {
            toast.current.show({ severity: 'info', summary: 'Внимание', detail: 'Нельзя добавить упражнение без названия', life: 3000 });
            return;
        }

        try {
            setExerciseLoader(true);
            const response = await SportApp.create_exercise({ title: newExercise.current.value, item_id: traningId }, token);
            setExercises([...exercises, response.data]);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: `Добавлено новое упражнение "${newExercise.current.value}"`, life: 3000 });
            newExercise.current.value = "";
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить новое упражнение', life: 3000 });
        } finally {
            setExerciseLoader(false);
        }
    }

    return (
        <div className={cl.container}>
            <Toast ref={toast} position="top-center" />
            <div className={cl.exerciseList}>
                {exercises.map((exercise) => (
                    <Exercise key={exercise.id} trExercise={exercise} />
                ))}
            </div>
            <p></p>
            <div className={cl.container}>
                <div className={cl.addExerciseSection}>

                    <div class="input-group mb-3">
                        <input ref={newExercise}
                            type="text"
                            className="form-control"
                            placeholder="Название упражнения"></input>
                        <div class="input-group-append">
                            <button className="btn btn-secondary" type="button"
                                disabled={exerciseLoader}
                                onClick={createExercise}
                            >
                                {exerciseLoader ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span> Добавление...
                                    </>
                                ) : (
                                    'Добавить'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ListExercises; 