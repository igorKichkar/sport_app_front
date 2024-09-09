import React from "react";
import { useNavigate } from "react-router-dom";
import cl from "./NotFound.module.css"; // Подключение стилей

function NotFound() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className={cl.container}>
            <h1 className={cl.title}>404</h1>
            <p className={cl.subtitle}>Упс! Страница не найдена.</p>
            <p className={cl.description}>
                Похоже, страница, которую вы ищете, не существует. Возможно, она была удалена или адрес введен неверно.
            </p>
            <button onClick={goHome} className={cl.button}>Вернуться на главную</button>
        </div>
    );
}

export default NotFound;
