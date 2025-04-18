import { Outlet, useLocation } from "react-router"
import Navbar from "./Navbar.tsx"
import Footer from "./Footer.tsx";

export default function Layout() {
    const location = useLocation();
    // const hiddenRoutesPath = [`/game/battleship/:${roomID}`];
    // const isHiddenRoute = hiddenRoutesPath.includes(location.pathname);
    const isGameRoom = /^\/game\/battleship\/[^/]+$/.test(location.pathname);
    return (
        <>
            {!isGameRoom && <Navbar />}
            <Outlet />
            {!isGameRoom && <Footer />}
        </>
    );
}