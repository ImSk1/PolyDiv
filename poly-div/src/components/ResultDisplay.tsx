import { MathJax } from "better-react-mathjax";

interface ResultDisplayProps {
  quotient: string;
  remainder: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ quotient, remainder }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Result</h3>
      {quotient && <MathJax>{`\\[\\text{Quotient:} \\ ${quotient}\\]`}</MathJax>}
      {remainder && remainder !== "0" && (
        <MathJax>{`\\[\\text{Remainder:} \\ ${remainder}\\]`}</MathJax>
      )}
    </div>
  );
};

export default ResultDisplay;
