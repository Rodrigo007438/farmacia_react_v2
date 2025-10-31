import React from "react";
import {Navigate, Outlet } from "react-router-dom";

//Verificador de Login

const Layout_protegido = () =>{
    const perfil = localStorage.getItem('perfil_usuario');

    if(!perfil){
        return <Navigate to='/login' replace />
    }
    return <Outlet/>

} 

export default Layout_protegido;