import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context";
import { useContext, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SportApp from "../API/SportApp";
import { Toast } from 'primereact/toast';

export function Navbar() {

  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate()

  function logOut() {
    Cookies.remove('token');
    setIsAuth(false);
    navigate("/login");
  }
  const token = Cookies.get("token");

  const toast = useRef(null);

  async function createTraning() {
      try {
          const response = await SportApp.create_traning({ title: "" }, token);
          toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Создана новая тренировка', life: 3000 });
          navigate(`/traning/${response.data.id}`);
          return;
      } catch (e) {
          toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать тренировку', life: 3000 });
      }
  }

  return (
    <header>
      <Toast ref={toast} position="top-center"></Toast>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <Link to="/" className="d-flex align-items-center link-body-emphasis text-decoration-none">
          <span className="fs-4">На главную</span>
        </Link>

        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          {isAuth ? <>
            <Link className="me-3 py-2 link-body-emphasis text-decoration-none" to="#" onClick={createTraning}>Начать тренировку</Link>
            <Link className="me-3 py-2 link-body-emphasis text-decoration-none" to="myexercises/">Мои упражнения</Link>
            <a className="py-2 link-body-emphasis text-decoration-none" href="#" onClick={logOut}>Выход</a>
          </>
            : <>
              <Link className="py-2 link-body-emphasis text-decoration-none" to="login/">Войти</Link>
            </>}
        </nav>
      </div>

      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
      </div>
    </header>
  );
}