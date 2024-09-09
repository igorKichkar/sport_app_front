import React, { useState } from "react";
import { TraningList } from "../Components/TraningList/TraningList";
import { AuthContext } from "../context";
import { useContext } from "react";
import Cookies from "js-cookie";
import SportApp from "../API/SportApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader/Loader";

function Main() {

    const navigate = useNavigate();

    const [userTranings, setUserTranings] = useState([]);

    const { isAuth, setIsAuth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const loadUser = async () => {
        if (!Cookies.get("token")) {
            navigate("/login");
            return;
        }
        try {
            setIsLoading(true);
            const response = await SportApp.getUser(Cookies.get("token"));
            setUserTranings(response.data.items);
            return;

        } catch (e) {
            if (e.response && e.response.status === 404) {
                navigate("/404"); // Перенаправляем на страницу 404
            } else {
                setIsAuth(false);
                Cookies.remove("token");
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [])

    return (
        <>{
            isLoading
                ? <Loader />
                : <TraningList userTranings={userTranings} setUserTranings={setUserTranings} loadUser={loadUser} />
        }
        </>
    )
}

export default Main;