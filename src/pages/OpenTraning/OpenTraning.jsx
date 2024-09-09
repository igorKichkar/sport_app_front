import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SportApp from "../../API/SportApp";
import Loader from "../../Components/Loader/Loader"

import ListExercises from "../../Components/ListExercises/ListExercises";
import TitleAndDescription from "../../Components/TitleAndDescription/TitleAndDescription";
import TraningImages from "../../Components/TraningImages/TraningImages";


function OpenTraning() {
    let { id } = useParams();
    const token = Cookies.get("token");
    const [traning, setTraning] = useState(null);
    const navigate = useNavigate();

    async function getTraning(id) {
        try {
            const response = await SportApp.getTraning(id, token);
            setTraning(response.data);
        } catch (e) {
            if (e.response && e.response.status === 404) {
                navigate("/404"); // Перенаправляем на страницу 404
            }
        }
    }

    useEffect(() => {
        getTraning(id);
    }, [id]);


    return (
        <>{
            traning
                ? <>
                    <TraningImages trImages={traning.images} trId={id} />
                    <TitleAndDescription trId={traning.id}
                        trTitle={traning.title}
                        trDescription={traning.description} />
                    <ListExercises trExercises={traning.exercises} traningId={id} />
                </>
                : <Loader />
        }
        </>
    )
}

export default OpenTraning;