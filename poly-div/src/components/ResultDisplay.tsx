interface ResultDisplayProps {
  quotient: string;
  remainder: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  quotient,
  remainder,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-creambg text-center italic">
        Result:{" "}
      </h3>
      {quotient && <p>Quotient: {quotient}</p>}
      {remainder && remainder !== "0" && <p>Remainder: {remainder}</p>}
    </div>
  );
};

export default ResultDisplay;
