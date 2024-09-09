import React from "react";
import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import SportApp from "../API/SportApp";
import { AuthContext } from "../context";
import { useContext } from "react";
import Cookies from "js-cookie";


function Registration() {
    const { isAuth, setIsAuth } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPasswors] = useState("");
    const [confirmPassword, setConfirmPasswors] = useState("");
    const [errors, setErrors] = useState([]);
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();

    async function submit(e) {
        let errorArray = [];

        if (!userName) {
            errorArray.push("Не указано имя");
        }

        if (!validator.isEmail(email)) {
            errorArray.push("Неправильно указан email");
        }

        if (!password || !confirmPassword || password !== confirmPassword) {
            errorArray.push("Неправильно указаны пароли");
        }

        if (errorArray.length) {
            setErrors(errorArray);
            return;
        }

        try {
            setLoader(true);
            const response = await SportApp.registration(userName, email, password);
            console.log(response);

            navigate("/login", { state: { message: "Регистрация прошла успешно, для входа введите Ваш emai и пароль." } });
            return;

        } catch (e) {
            console.log(e);
            if ((e?.response?.status ?? null) === 400) {
                errorArray.push("Email уже зарегистрирован");
            } else {
                errorArray.push(`Ошибка сервиса регистрации`);
            }
            setErrors(errorArray);
        } finally {
            setLoader(false);
        }
    }

    return (
        <div>
            {
                errors.length ? <div className="alert alert-warning text-center" role="alert">
                    {errors.join(". ")}.
                </div>
                    : ""
            }

            <section className="vh-100" >

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" >
                                <div className="card-body p-5 text-center">

                                    <h3 className="mb-5">Регистрация</h3>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Имя"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            type="text"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typeEmail">Имя</label> */}
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typeEmail">Email</label> */}
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Пароль"
                                            value={password}
                                            onChange={(e) => setPasswors(e.target.value)}
                                            type="password"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typePassword">Пароль</label> */}
                                    </div>
                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Подтвердите пароль"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPasswors(e.target.value)}
                                            type="password"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typePassword">Подтвердите пароль</label> */}
                                    </div>
                                    {loader
                                        ? <button style={{ "width": "125px" }} className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Загрузка...
                                        </button>
                                        : <button
                                            onClick={submit}
                                            className="btn btn-primary login_btn"
                                            type="submit">Отправить
                                        </button>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default Registration;