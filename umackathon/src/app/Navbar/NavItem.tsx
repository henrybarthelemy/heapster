import React from "react";
import "./index.css";
import "../globals.css";
import NavSubItem from "./NavSubItem";
import Link from "next/link";

type NavItemProps = {
    topic: string,
    href: string,
    subtopics: any[],
    main: boolean
};

const NavItem: React.FC<NavItemProps> = ({ topic, href, subtopics, main}) => {
    return (
        <div className="pe-5 h-navitem col">
            {subtopics.length > 0 && (
                <div className={`${main ? `absolute h-nav-${href.substring(1)}`: "flex row"}`}>
                    <Link href={href} className="h-navitemtext pe-2 font-medium">
                        {topic}
                    </Link>
                    {/* COMMENTED OUT FOR NOW BC NAVBAR DOESNT WORK LOL */}
                    {/* <div className={`h-navitemmenu`}>
                        {subtopics.map((subtopic, index) => (
                            <NavItem key={index} topic={subtopic.topic} href={subtopic.href} subtopics={subtopic.subtopics} main={false}/>
                        ))}
                    </div> */}
                </div>
            )}
            {subtopics.length == 0 && (
                <div>
                    <NavSubItem topic={topic} href={href} />
                </div>
            )}
        </div>
    );
}

export default NavItem;
