import React from "react";
import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import SportApp from "../API/SportApp";
import { AuthContext } from "../context";
import { useContext } from "react";
import Cookies from "js-cookie";
import { Link, useLocation } from "react-router-dom";


function LoginForm() {
    const { isAuth, setIsAuth } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPasswors] = useState("");
    const [errors, setErrors] = useState([]);
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function submit(e) {
        let errorArray = [];
        e.preventDefault();

        if (!validator.isEmail(email)) {
            errorArray.push("Неправильно указан email");
        }

        if (!password) {
            errorArray.push("Неуказан пароль");
        }

        if (errorArray.length) {
            setErrors(errorArray);
            return;
        }

        try {
            setLoader(true);
            const response = await SportApp.login(email, password);
            setIsAuth(true);
            Cookies.set("token", response.data.access_token);
            navigate("/");
            return;

        } catch (e) {
            if ((e?.response?.status ?? null) === 401) {
                errorArray.push("Неверный логин или пароль");
            } else {
                errorArray.push(`Ошибка сервиса авторизации`);
            }
            setErrors(errorArray);
        } finally {
            setLoader(false);
        }
    }

    return (
        <div>
            {
                ((location?.state?.message ?? null) && !errors.length) ? <div className="alert alert-success text-center" role="alert">
                    {location.state.message}
                </div>
                    : ""
            }


            {
                errors.length ? <div className="alert alert-warning text-center" role="alert">
                    {errors.join(". ")}.
                </div>
                    : ""
            }
            <div className="text-center"><h2>Добро пожаловать!</h2>
                <p >Для доступа к сервису необходима авторизация.</p></div>

            <section className="vh-100" >

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" >
                                <div className="card-body p-5 text-center">

                                    {/* <h3 className="mb-5">Авторизация</h3> */}

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            id="typeEmail"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typeEmail">Email</label> */}
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            placeholder="Пароль"
                                            value={password}
                                            onChange={(e) => setPasswors(e.target.value)}
                                            type="password"
                                            id="typePassword"
                                            className="form-control form-control-lg" />
                                        {/* <label className="form-label" htmlFor="typePassword">Пароль</label> */}
                                    </div>
                                    {loader
                                        ? <button style={{ "width": "125px" }} className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Загрузка...
                                        </button>
                                        : <button
                                            onClick={submit}
                                            className="btn btn-primary login_btn"
                                            type="submit">Войти
                                        </button>

                                    }

                                    <Link to="/registration" type="button" className="btn btn-link">Регистрация</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default LoginForm;