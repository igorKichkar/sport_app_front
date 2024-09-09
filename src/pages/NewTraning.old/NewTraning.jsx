import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext} from "../../context";

import MyInput from "../../UI/MyInput/MyInput";
import MyTextarea from "../../UI/MyTextarea/MyTextarea";
import MyButton from "../../UI/MyButton/MyButton";
import { useState, useEffect, useContext, useRef } from "react";
import cl from "./NewTraning.module.css"
import SportApp from "../../API/SportApp";
import { sum } from "../../utils";
import { useParams } from "react-router-dom";
import TrashButton from "../../Components/TrashButton/TrashButton";
import MyModal from "../../Components/MyModal/MyModal";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import Cookies from "js-cookie";
import { AuthImage } from "react-auth-image";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import ListImages from "../../Components/ListImages/ListImages";
import { TraningId } from "../../context";


function NewTraning2() {
    
    const token = Cookies.get("token");

    const toast = useRef(null);
    const traningDescription = useRef("");
    const traningTitle = useRef("");
    const exercise = useRef("");

    let { id } = useParams();
    const [traningId, setTraningId] = useState(id);
    const [tranings, setTranings] = useState([]);
    const [approuchLoader, setApprouchLoader] = useState({});
    const [exersiseLoader, setExersiseLoader] = useState(false);
    const [itemImages, setItemImages] = useState([]);

    const { contextTraningId, setContextTraningId } = useContext(TraningId);


    async function createTraning() {
        try {
            console.log("create NEW traning");
            setTranings([]);
            const response = await SportApp.create_traning({ title: "" }, token);
            setTraningId(response.data.id);
            setContextTraningId(response.data.id);
            traningTitle.current.value = "";
            traningDescription.current.value = "";
            return;
        } catch (e) {
            console.log(e);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать тренировку', life: 3000 });
        } finally {
        }
    }

    async function getTraning(id) {
        try {
            const response = await SportApp.getTraning(id, token);
            console.log(response);
            const exercises = response.data.exercises;
            const tempTranings = [];
            for (const exercise of exercises) {
                const sets = [];
                for (const set of exercise.approaches) {
                    sets.push({ ammount: set.ammount, id: set.id })
                }
                tempTranings.push({ id: exercise.id, title: exercise.title, sets })
            }
            setTraningId(response.data.id);
            setContextTraningId(response.data.id);
            traningTitle.current.value = response.data.title;
            traningDescription.current.value = response.data.description;
            setTranings(tempTranings);
            if (!itemImages.length) setItemImages(response.data.images);
            return;
        } catch (e) {
            console.log(e);
        } finally {
        }
    }
    console.log(id);
    useEffect(() => {
        
        if (id) {
            getTraning(id);
            return;
        }
        createTraning();
    }, [id]);

    async function createExersise() {
        if (!exercise.current.value) return;

        try {
            setExersiseLoader(true);
            const response = await SportApp.create_exercise({ title: exercise.current.value, item_id: traningId }, token);
            setTranings([...tranings, { id: response.data.id, title: response.data.title, sets: [] }]);
            setApprouchLoader({ ...approuchLoader, [response.data.id]: false });
            exercise.current.value = "";
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать упражнение', life: 3000 });
        } finally {
            setExersiseLoader(false);
        }
    }

    async function createApprouch(e) {
        const exercise_id = e.target.attributes.exercise_id.value;
        let ammount = document.getElementById(`traning_${exercise_id}`).value;
        if (!ammount) return;

        try {
            const tempApprouchLoader = { ...approuchLoader };
            tempApprouchLoader[exercise_id] = true;
            setApprouchLoader({ ...tempApprouchLoader });

            let targetTraningId;
            const response = await SportApp.create_approuch({ exercise_id: exercise_id, ammount: ammount }, token);
            const tempTranings = [...tranings];

            for (let i = 0; i < tranings.length; i++) {
                if (tranings[i].id === +exercise_id) {
                    targetTraningId = i;
                    break;
                }

            }

            tempTranings[targetTraningId].sets.push({ ammount: response.data.ammount, id: response.data.id })
            setTranings(tempTranings)

        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать подход ', life: 3000 });
            console.error(e)
        } finally {
            const tempApprouchLoader = { ...approuchLoader };
            tempApprouchLoader[exercise_id] = false;
            setApprouchLoader({ ...tempApprouchLoader });
        }
    }

    async function putTraning() {
        try {
            console.log("upate title and description");
            const response = await SportApp.update_item(traningId, {
                title: traningTitle.current.value,
                description: traningDescription.current.value
            }, token);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изменения внесены', life: 3000 });
        } catch (e) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить изменения', life: 3000 });
            console.error(e)
        }
    }

    function ButtonRemoveApprouch({ id_approuch }) {
        const [modal, setModal] = useState(false);

        async function removeApprouch(id_approuch) {
            console.log(id_approuch)
            try {
                await SportApp.delete_approuch(id_approuch, token);
                console.log(tranings);
            } catch (e) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить подход', life: 3000 });
                console.log(e);
            } finally {
                getTraning(traningId);
                setModal(false);
            }
        }

        return (<>
            <MyModal visible={modal} setVisible={setModal}><ConfirmDialog setModal={setModal} dialog="Удалить подход?" confirmAction={() => { removeApprouch(id_approuch) }} /></MyModal>
            <span className={cl.removeApprouch} onClick={() => setModal(true)}>x</span>
        </>
        )
    }


    function Exercise({ exercise }) {

        const [modal, setModal] = useState(false);

        async function removeExercise(id) {
            try {
                await SportApp.delete_exercise(id, token);
            } catch (e) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить упражнение', life: 3000 });
                console.log(e);
            } finally {
                console.log(traningId)
                getTraning(traningId);
                setModal(false);
            }
        }

        function createDialogQuestion(question, obj) {
            return `${question} "${obj}"?`
        }

        return (<div className={cl.traning}>
            <MyModal visible={modal} setVisible={setModal}><ConfirmDialog setModal={setModal} dialog={createDialogQuestion('Удалить упражнение', exercise.title)} confirmAction={() => { removeExercise(exercise.id) }} /></MyModal>
            <span className={cl.titleExercise}>{exercise.title}</span>
            <span className={cl.removeExercise}><TrashButton onClick={() => { setModal(true) }} /></span>

            <div className={cl.table}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Подход</th>
                            <th scope="col">Количество</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            exercise.sets.map((set, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{set.ammount}</td>
                                    <td><ButtonRemoveApprouch id_approuch={set.id} /></td>
                                </tr>
                            })
                        }

                    </tbody>
                </table>
            </div>

            <p className={cl.sumText}>Выполнено <span className={cl.sum}>{sum(exercise.sets)}</span> повторений</p>
            <div className="input-group mb-3">
                <input style={{ marginLeft: "5px" }} id={`traning_${exercise.id}`} type="text" className="form-control" placeholder="Количество повторений"></input>
                <div className="input-group-append">
                    {
                        approuchLoader[exercise.id]
                            ? <button style={{ "width": "150px" }} className="btn btn-outline-secondary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" ></span>
                                Сохранение...
                            </button>
                            : <button
                                style={{ "width": "150px", marginRight: "5px", backgroundColor: "rgb(214 215 213)" }}
                                exercise_id={exercise.id}
                                onClick={(e) => createApprouch(e)}
                                className="btn btn-outline-secondary" type="button">Записать</button>
                    }
                </div>
            </div>
        </div>)
    }


    return (<div>
        <Toast ref={toast} position="top-center"></Toast>
        {/* <ListImages token={token} traningId={traningId}/> */}
        {/* <div>
            {itemImages.map((image) => <AuthImage
                className={cl.imageWrapper}
                key={image.id}
                src={`http://localhost:8000/images/${image.title}`}
                token={token}
                errorCallback={() => { }}
            />)}
        </div> */}



        

        {/* <MyInput value={traningTitle} setValue={setTraningTitle} placeholder="Название тренировки" /> */}

        <div className="form-group">
            <input
                ref={traningTitle}
                className="form-control"
                placeholder="Название тренировки">
            </input>
        </div>
        {/* <MyTextarea value={traningDescription} ref={traningDescription} setValue={()=>{}} placeholder="Описание" /> */}

        <div className="form-group">
            <textarea ref={traningDescription} placeholder="Описание" className="form-control" rows="3"></textarea>
        </div>

        <MyButton title="Сохранить название и описание" onClick={putTraning} />

        {
            tranings.map((exercise) => <Exercise exercise={exercise} setTranings={setTranings} key={exercise.id} />)
        }

        <div className="input-group mb-3">
            <input ref={exercise} type="text" className="form-control" placeholder="Название нового упражнения"></input>
            <div className="input-group-append">
                {
                    exersiseLoader
                        ? <button style={{ "width": "150px" }} className="btn btn-outline-secondary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" ></span>
                            Сохранение...
                        </button>
                        : <button onClick={createExersise} className="btn btn-outline-secondary" type="button">Начать</button>
                }
            </div>
        </div>
    </div>)
}
function NewTraning() {
    
    const navigate = useNavigate();
    const { isAuth, setIsAuth } = useContext(AuthContext);
    if (!isAuth) navigate("/login");
    
    const token = Cookies.get("token");

    let { id } = useParams();

    return (
        <>
            <ListImages token={token} traningId={id} />
            <NewTraning2 />
        </>
    )
}

export default NewTraning;