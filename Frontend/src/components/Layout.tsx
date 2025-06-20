import { Outlet, useLocation } from "react-router"
import Navbar from "./Navbar.tsx"
import Footer from "./Footer.tsx";

export default function Layout() {
    const location = useLocation();
    // const hiddenRoutesPath = [`/game/battleship/:${roomID}`];
    // const isHiddenRoute = hiddenRoutesPath.includes(location.pathname);
    const isGameRoom = /^\/game\/battleship\/[^/]+$/.test(location.pathname);
    const isRoomChat = /^\/games\/roomchat\/[^/]+$/.test(location.pathname);
    const shouldHideLayout = isGameRoom || isRoomChat;
    return (
        <>
            {!shouldHideLayout && <Navbar />}
            <Outlet />
            {!shouldHideLayout && <Footer />}
        </>
    );
}