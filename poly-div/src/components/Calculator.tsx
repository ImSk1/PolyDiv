import { useState } from "react";
import Polynomial from "polynomial";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import PolynomialForm from "./PolynomialForm";
import DivideButton from "./DivideButton";
import ResultDisplay from "./ResultDisplay";
import DivisionTable from "./DivisionTable";

function Calculator() {
  const [dividend, setDividend] = useState<string>(""); // The polynomial string in JSON format
  const [divisor, setDivisor] = useState<string>(""); // The divisor string
  const [quotient, setQuotient] = useState<string>(""); // Store the quotient
  const [remainder, setRemainder] = useState<string>(""); // Store the remainder
  const [traceSteps, setTraceSteps] = useState<string[]>([]); // Store the trace steps
  const [tableData, setTableData] = useState<boolean>(false);
  const [dividendPolynomial, setDividedPolynomial] = useState<Polynomial>();

  const handleDivide = () => {
    try {
      // Ensure we have valid inputs
      if (!dividend || !divisor) {
        alert("Please enter both dividend and divisor.");
        return;
      }
      console.log(dividend)
      console.log(divisor)
      // Convert the stringified polynomial object back to a real object
      const parsedDividend = JSON.parse(dividend);

      // Enable tracing of the division steps
      Polynomial.trace = true;

      // Create polynomial objects from input strings
      const dividendPoly = new Polynomial(parsedDividend); // Use object format
      const divisorPoly = new Polynomial(divisor);

      console.log(dividendPoly.toString())
      console.log(divisorPoly.toString())
      // Perform the division
      const divisionResult = dividendPoly.div(divisorPoly);

      // Get the trace steps in LaTeX format
      const trace = Polynomial.trace.map((step) => step.toLatex());

      // Extract quotient and remainder
      const quotientResult = divisionResult.toLatex(); // Quotient after division
      const remainderResult = dividendPoly.mod(divisorPoly).toLatex(); // Remainder after division

      // Set quotient and remainder in state
      setQuotient(quotientResult);
      setRemainder(remainderResult);
      setTraceSteps(trace); // Set the trace steps to display
      setDividedPolynomial(dividendPoly)

      // Keep the table data visible, without hiding it
      setTableData(true);

      // Reset tracing
      Polynomial.trace = false;
    } catch (error) {
      alert("Error performing division. Please check your input.");
      setTableData(false); // Hide table data if there's an error
    }
  };

  return (
    <div className="h-full px-32 py-16 w-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold mb-24 text-creambg">
        Synth<span className="text-richblack">Div</span>
      </h1>
      <PolynomialForm setDividend={setDividend} setDivisor={setDivisor} />
      <DivideButton onClick={handleDivide} />

      {tableData && (
        <MathJaxContext>
          <h3 className="text-creambg font-bold italic mt-6">Dividend:</h3>
          <MathJax className=" ">{`\\[\\ ${dividendPolynomial}\\]`}</MathJax>

          <ResultDisplay quotient={quotient} remainder={remainder} />
          <DivisionTable
            quotient={quotient}
            divisor={divisor}
            traceSteps={traceSteps}
          />
        </MathJaxContext>
      )}
    </div>
  );
}

export default Calculator;
