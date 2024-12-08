import Polynomial from "polynomial";

interface DivisionTableProps {
  quotient: string;
  divisor: string;
  traceSteps: string[];
}

const DivisionTable: React.FC<DivisionTableProps> = ({
  quotient,
  divisor,
  traceSteps,
}) => {
  return (
    <div className="overflow-x-auto mt-4 w-full sm:w-3/4 lg:w-full">
      <h3 className="text-xl font-semibold mt-4 italic text-center">
        Division Steps:
      </h3>
      <table className="table-auto text-creambg border-separate border-spacing-0 w-full text-center">
        <thead>
          <tr>
            <th className="border-b-2 border-creambg p-2"></th>
            <th className="border-b-2 border-creambg p-2 text-right">
              {quotient}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-r-2 border-creambg text-left">
              {new Polynomial(divisor).toString()}
            </td>
            <td className="p-2 border-b-2 border-creambg text-right">
              {traceSteps[0]}
            </td>
          </tr>
          {traceSteps.slice(1).map((step, index) => (
            <tr key={index}>
              <td className="border-r-2 border-creambg"></td>
              <td
                className={`p-2 ${
                  index === traceSteps.length - 2
                    ? ""
                    : "border-b-2 border-creambg "
                } text-right`}
              >
                {step}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DivisionTable;
