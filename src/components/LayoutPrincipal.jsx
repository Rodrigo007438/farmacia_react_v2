import React from "react";
import { Outlet } from "react-router-dom";
import Header from './Header';

function Layout_principal(){
    return(
        <>
            <Header>
                <main className="site_content">
                    <Outlet />
                </main>
            </Header>
        </>
    )
}

export default Layout_principal;