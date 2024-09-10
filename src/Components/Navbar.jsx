import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SportApp from "../API/SportApp";
import { Toast } from 'primereact/toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDumbbell, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [loaderCreateTraning, setLoaderCreateTraning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toast = useRef(null);
  const token = Cookies.get("token");

  function logOut() {
    Cookies.remove('token');
    setIsAuth(false);
    navigate("/login");
  }

  async function createTraning() {
    if (loaderCreateTraning) return;
    try {
      setLoaderCreateTraning(true);
      const response = await SportApp.create_traning({ title: "" }, token);
      toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Создана новая тренировка', life: 3000 });
      navigate(`/traning/${response.data.id}`);
    } catch (e) {
      toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать тренировку', life: 3000 });
    } finally {
      setLoaderCreateTraning(false);
    }
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (isMenuOpen && e.target.classList.contains('overlay')) {
      handleMenuClose();
    }
  };

  return (
    <header className={`navbar`} onClick={handleOverlayClick}>
      <Toast ref={toast} position="top-center" />
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom" style={{width: "100%"}}>
        <Link to="/" className="d-flex align-items-center link-body-emphasis text-decoration-none">
          <span className="fs-4">На главную</span>
        </Link>
        
        <button 
          className="navbar-toggler d-md-none" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <nav className={`navbar-collapse ${isMenuOpen ? "show" : ""} d-md-flex mt-2 mt-md-0 ms-md-auto`}>
          {isAuth ? (
            <>
              <a  
                className="me-3 py-2 link-body-emphasis text-decoration-none " 
                href="#" 
                onClick={() => { createTraning(); handleMenuClose(); }}
                style={{marginLeft: "19px"}}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2 icon" /> Начать тренировку
              </a>
              <Link 
                className="me-3 py-2 link-body-emphasis text-decoration-none" 
                to="myexercises/"
                onClick={handleMenuClose}
                
              >
                <FontAwesomeIcon icon={faDumbbell} className="me-2 icon" /> Мои упражнения
              </Link>
              <a 
                className="py-2 link-body-emphasis text-decoration-none" 
                href="#" 
                onClick={() => { logOut(); handleMenuClose(); }}
                style={{marginRight: "90px"}}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2 icon" /> Выход
              </a>
            </>
          ) : (
            <Link 
              className="py-2 link-body-emphasis text-decoration-none" 
              to="login/"
              onClick={handleMenuClose}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="me-2 icon" /> Войти
            </Link>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="overlay" />
      )}
    </header>
  );
}