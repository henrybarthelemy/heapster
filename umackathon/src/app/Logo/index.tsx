import "../globals.css"

const Logo = ({fontSize = "text-7xl"}) => {
    return(
        <span className="flex text-center">
            <text className={`${fontSize} font-medium h-accent`}>H</text>
        </span>
    )
}

export default Logo;