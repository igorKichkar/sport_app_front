import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './pages/Main';
import LoginForm from './pages/Login';
import Registration from './pages/Registratin';
import { Navbar } from './Components/Navbar';
import OpenTraning from './pages/OpenTraning/OpenTraning';
import { useState, useEffect } from "react";
import { AuthContext } from './context';
import Cookies from 'js-cookie';
import MyExercises from './pages/MyExercises';
import NotFound from './pages/NotFound/NotFound';

import "primereact/resources/themes/lara-light-cyan/theme.css";

function App() {

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) setIsAuth(true);
  }, [])

  return (
    <BrowserRouter>

      <AuthContext.Provider value={{ isAuth, setIsAuth }}>

        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/myexercises" element={<MyExercises />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/traning/:id" element={<OpenTraning />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </AuthContext.Provider>
    </BrowserRouter>

  );
}

export default App;
