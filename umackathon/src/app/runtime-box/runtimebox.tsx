import "./style.css";
export default function RuntimeBox({stats}) {
    return (
        <table className="tableStyle">
            <thead>
            <tr>
                <th className="thStyle">Operation</th>
                <th className="thStyle">Time Complexity</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(stats).map(([operation, complexity]) => (
                <tr key={operation}>
                    <td className="tdStyle">{operation}</td>
                    <td className="tdStyle">{complexity}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}



