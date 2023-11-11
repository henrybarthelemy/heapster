import Logo from "../Logo";
import "../globals.css";
import NavItem from "./NavItem";
import "./index.css";
import topics from "./topics.json";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center h-[5.5rem] h-navbar px-4">
            <div className="col-start-8 ">
                <Logo />
                <div>
                    a
                </div>
            </div>
            <div className="col-end4">
                <text>Login</text>
            </div>
        </div>
    );
}