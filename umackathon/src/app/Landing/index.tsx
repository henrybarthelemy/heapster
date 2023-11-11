import "../globals.css"
import Logo from "../Logo"
import topics from "../Navbar/topics.json";
import { Box } from "./box";

export default function Landing() {
    const flavorText = [
        "Heaping up with the Kar-graph-ians",
        "The tree-siet way to learn comp sci",
        "Frick it we bool(ean)"
    ]
    const randomFlavorText = flavorText[Math.floor(Math.random() * flavorText.length)]
    return (
        <div className="flex-col justify-center pt-8">
            <div className="justify-center pb-3">
                <span className="text-7xl font-medium flex row items-end justify-center">
                    <Logo />
                    <span>eapster</span>
                </span>
            </div>
            <div className="flex row justify-center items-center">
                <text className="text-xl font-normal text-center px-3">{randomFlavorText}</text>
            </div>
            <div className="flex flex-col md:flex-row gap-5 items-center md:items-start justify-center mt-8">
                {topics.map((topic) => (
                    <Box topic={topic.topic} href={topic.href} subtopics={topic.subtopics} />
                ))}
            </div>
        </div>
    )
}