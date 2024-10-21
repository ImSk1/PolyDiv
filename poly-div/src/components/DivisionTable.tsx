import { MathJax } from "better-react-mathjax";
import Polynomial  from "polynomial";

interface DivisionTableProps {
  quotient: string;
  divisor: string;
  traceSteps: string[];
}

const DivisionTable: React.FC<DivisionTableProps> = ({ quotient, divisor, traceSteps }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <h3 className="text-xl font-semibold mt-4">Division Steps (Trace)</h3>
      <table className="table-auto border-separate border-spacing-0 w-full text-center">
        <thead>
          <tr>
            <th className="border-b-2 p-2"></th>
            <th className="border-b-2 p-2 text-right">
              <MathJax>{`\\[${quotient}\\]`}</MathJax> {/* Quotient displayed at the top */}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-r-2 text-left">
              <MathJax>{`\\[${new Polynomial(divisor).toLatex()}\\]`}</MathJax> {/* Divisor */}
            </td>
            <td className="p-2 border-b-2 text-right">
              <MathJax>{`\\[${traceSteps[0]}\\]`}</MathJax>
            </td>
          </tr>
          {traceSteps.slice(1).map((step, index) => (
            <tr key={index}>
              <td className="border-r-2"></td>
              <td className={`p-2 ${index === traceSteps.length - 2 ? '' : 'border-b-2'} text-right`}>
                <MathJax>{`\\[${step}\\]`}</MathJax>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DivisionTable;
