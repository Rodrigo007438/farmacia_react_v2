import React, {createContext, useState, useContext, useEffect} from "react";

const AuthContext = createContext(null);


export function AuthProvider({children}){
    const [perfil, set_perfil] = useState(null);

    
    useEffect(() => {

        const [perfil, set_perfil] = useState(() =>{
            return localStorage.getItem('perfil_usuario') || null;
        })
    })
        

    const login = (perfil_user, email_user = null) =>{
        localStorage.setItem('perfil_usuario', perfil_user);
        if(email_user){
            localStorage.setItem('email_usuario', email_user);
        }
        set_perfil(perfil_user);
    };

    const logout = () =>{
        localStorage.removeItem('perfil_usuario');
        localStorage.removeItem('email_usuario');
        set_perfil(null);
    };

    return (
        <AuthContext.Provider value={{ perfil, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}



export const useAuth = () => {
    return useContext(AuthContext);
};

    
