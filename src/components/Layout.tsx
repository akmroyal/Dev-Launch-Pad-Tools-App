import { Outlet, useLocation } from "react-router"
import Navbar from "./Navbar.tsx"
import Footer from "./Footer.tsx";

export default function Layout() {
    const location = useLocation();
    const hiddenRoutesPath = ["/game/battleship"];
    const isHiddenRoute = hiddenRoutesPath.includes(location.pathname);

    return (
        <>
            {!isHiddenRoute || <Navbar />}
            {/* <Navbar /> */}
            <Outlet />
            {!isHiddenRoute && <Footer />}
        </>
    );
}