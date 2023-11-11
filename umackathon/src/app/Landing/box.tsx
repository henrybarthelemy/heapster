import "./index.css";
import "../globals.css";
import Link from "next/link";

type BoxProps = {
    topic: string,
    href: string
    subtopics: any[]
};

export const Box: React.FC<BoxProps> = ({ topic, href, subtopics }) => {
    return (
        <div className="col-4">
            <div className="h-box">
                <div className="h-boxtitle pb-3">
                    <Link href={href} className="col inline-grid">
                        <text className="h-boxtitletext font-medium text-2xl">{topic}</text>
                        <div className="w-auto relative">
                            <div className="overflow-hidden">
                                <div className="h-boxtitlenohover" />
                            </div>
                            <div className="h-boxtitlehover" />
                        </div>
                    </Link>
                </div>
                <div className="h-boxcontent">
                    {subtopics.map((subtopic) => (
                        <div className="h-boxsubtopic pb-1">
                            <Link href={subtopic.href}>
                                <text className="h-boxsubtopictext">{subtopic.topic}</text>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}