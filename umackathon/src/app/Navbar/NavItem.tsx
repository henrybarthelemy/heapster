import React from "react";
import "./index.css";
import "../globals.css";
import NavSubItem from "./NavSubItem";

const NavItem = (topic: string, href: string, { children }: { children: React.ReactNode }) => {
    return (
        <div className="h-navitem">
            <a href={link}>
                {topic}
            </a>
            <div className="h-navitemmenu">
                {children}
            </div>
        </div>
    );
}

export default NavItem;