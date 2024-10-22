import { useState } from "react";
import Polynomial from "polynomial";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import PolynomialForm from "./PolynomialForm";
import DivideButton from "./DivideButton";
import ResultDisplay from "./ResultDisplay";
import DivisionTable from "./DivisionTable";

function Calculator() {
  const [dividend, setDividend] = useState<string>(""); 
  const [divisor, setDivisor] = useState<string>(""); 
  const [quotient, setQuotient] = useState<string>(""); 
  const [remainder, setRemainder] = useState<string>(""); 
  const [traceSteps, setTraceSteps] = useState<string[]>([]);
  const [tableData, setTableData] = useState<boolean>(false);
  const [dividendPolynomial, setDividedPolynomial] = useState<Polynomial>();

  const handleDivide = () => {
    try {
      if (!dividend || !divisor) {
        alert("Please enter both dividend and divisor.");
        return;
      }
      const parsedDividend = JSON.parse(dividend);
      Polynomial.trace = true;
      const dividendPoly = new Polynomial(parsedDividend);
      const divisorPoly = new Polynomial(divisor);

      const divisionResult = dividendPoly.div(divisorPoly);
      const trace = Polynomial.trace.map((step) => step.toLatex());
      const quotientResult = divisionResult.toLatex();
      const remainderResult = dividendPoly.mod(divisorPoly).toLatex();

      setQuotient(quotientResult);
      setRemainder(remainderResult);
      setTraceSteps(trace);
      setDividedPolynomial(dividendPoly);
      setTableData(true);

      Polynomial.trace = false;
    } catch (error) {
      alert("Error performing division. Please check your input.");
      setTableData(false);
    }
  };

  return (
    <div className="h-full px-4 py-8 md:px-16 lg:px-32 lg:py-16 w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold mb-12 lg:mb-24 text-creambg">
        Synth<span className="text-richblack">Div</span>
      </h1>
      <PolynomialForm setDividend={setDividend} setDivisor={setDivisor} />
      <DivideButton onClick={handleDivide} />

      {tableData && (
        <MathJaxContext>
          <h3 className="text-creambg font-bold italic mt-6">Dividend:</h3>
          <MathJax>{`\\[\\ ${dividendPolynomial}\\]`}</MathJax>

          <ResultDisplay quotient={quotient} remainder={remainder} />
          <DivisionTable quotient={quotient} divisor={divisor} traceSteps={traceSteps} />
        </MathJaxContext>
      )}
    </div>
  );
}

export default Calculator;
