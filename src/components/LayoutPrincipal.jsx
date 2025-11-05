import React from "react";
import { Outlet } from "react-router-dom";
import Header from './Header';

function LayoutPrincipal(){
    return(
        <>
            <Header />
                <main className="site_content">
                    <Outlet />
                </main>
           
        </>
    )
}

export default LayoutPrincipal;