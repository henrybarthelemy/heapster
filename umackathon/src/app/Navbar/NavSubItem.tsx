import "./index.css";
import "../globals.css";
import Link from "next/link";

type NavSubItemProps = {
    topic: string,
    href: string,
};


const NavSubItem: React.FC<NavSubItemProps> = ({ topic, href }) => {
    return (
        <div className="h-navsubitem">
            <Link href={href}>
                <div>
                    <text className="h-navitemtext">{topic}</text>
                </div>
            </Link>
        </div>
    )
}

export default NavSubItem;

