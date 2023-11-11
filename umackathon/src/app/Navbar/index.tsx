import Logo from "../Logo";
import "../globals.css";
import NavItem from "./NavItem";
import "./index.css";
import topics from "./topics.json";

export default function Navbar() {

    return (
        <div className="flex justify-between items-end h-[5.5rem] h-navbar px-4 pb-2 sticky top-0">
            <div className="col-start-8 ">
                <div className="flex items-end">
                    <Logo />
                    <div className="ps-5 pb-1 hidden md:block">
                        <div className="flex row">
                            {topics.map((topic, index) => (
                                <NavItem key={index} topic={topic.topic} href={topic.href} subtopics={topic.subtopics} main={true}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-end-4">
                <text>Login</text>
            </div>
        </div>
    );
}