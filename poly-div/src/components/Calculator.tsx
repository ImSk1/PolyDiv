import { useState } from "react";
import Polynomial from "polynomial";
import PolynomialForm from "./PolynomialForm";
import DivideButton from "./DivideButton";
import ResultDisplay from "./ResultDisplay";
import DivisionTable from "./DivisionTable";
import nerdamer from "nerdamer";
import "nerdamer/all"; // Ensure all modules are loaded

function Calculator() {
  const [dividend, setDividend] = useState<string>("");
  const [divisor, setDivisor] = useState<string>("");
  const [quotient, setQuotient] = useState<string>("");
  const [remainder, setRemainder] = useState<string>("");
  const [traceSteps, setTraceSteps] = useState<string[]>([]);
  const [tableData, setTableData] = useState<boolean>(false);
  const [dividendPolynomial, setDividedPolynomial] =
    useState<Polynomial | null>(null);
  const [roots, setRoots] = useState<string[]>([]);

  const calculateDividendPolynomial = () => {
    try {
      if (!dividend) {
        alert("Please enter the dividend.");
        return null;
      }
      const parsedDividend = JSON.parse(dividend);
      const polynomial = new Polynomial(parsedDividend);
      setDividedPolynomial(polynomial);
      return polynomial;
    } catch (error) {
      console.error("Error calculating dividend polynomial:", error);
      alert("Invalid dividend format.");
      return null;
    }
  };

  const handleDivide = () => {
    try {
      if (!dividend || !divisor) {
        alert("Please enter both dividend and divisor.");
        return;
      }
      const dividendPoly = calculateDividendPolynomial();
      if (!dividendPoly) return;

      const divisorPoly = new Polynomial(divisor);

      const divisionResult = dividendPoly.div(divisorPoly);
      const trace = (Polynomial as any).trace.map((step: any) =>
        step.toString()
      );
      const quotientResult = divisionResult.toString();
      const remainderResult = dividendPoly.mod(divisorPoly).toString();

      setQuotient(quotientResult);
      setRemainder(remainderResult);
      setTraceSteps(trace);
      setTableData(true);
      setRoots([]); // Clear roots when performing division
    } catch (error) {
      alert("Error performing division. Please check your input.");
      console.log(error);
      setTableData(false);
    }
  };

  const handleFindRoots = () => {
    try {
      let polynomial = dividendPolynomial;
      if (!polynomial) {
        // Automatically calculate the dividend polynomial if it hasn't been calculated yet
        polynomial = calculateDividendPolynomial();
        if (!polynomial) return;
      }

      // Convert the polynomial to string format for nerdamer
      const coeff = polynomial.coeff;
      const maxDegree = Math.max(...Object.keys(coeff).map(Number));
      const coefficients = Array.from(
        { length: maxDegree + 1 },
        (_, i) => coeff[i] || 0
      );

      const polyExpr = coefficients
        .reverse()
        .map((c, i) => `${c}*x^${maxDegree - i}`)
        .join(" + ");

      console.log("Polynomial Expression:", polyExpr);

      // Use nerdamer to find roots
      const roots = findRoots(polyExpr);

      if (roots.length === 0) {
        alert("No real roots found.");
      } else {
        console.log("Roots Found:", roots);
        setRoots(roots); // Save the roots for display
      }
    } catch (error) {
      alert("Error finding roots. Please check your polynomial.");
      console.log(error);
    }
  };

  function findRoots(polyInput: string): string[] {
    try {
      // Solve for roots using nerdamer
      let roots = nerdamer(`solve(${polyInput}, x)`).evaluate().text();

      // Remove the square brackets at the beginning and end of the string
      roots = roots.replace(/^\[|\]$/g, "");

      // Split roots and filter out imaginary ones
      return roots
        .split(",")
        .filter((root) => !root.includes("i"))
        .map((r) => r.trim());
    } catch (error) {
      console.error("Error finding roots:", error);
      return [];
    }
  }

  return (
    <div className="h-full px-4 py-8 md:px-16 lg:px-32 lg:py-16 w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold mb-12 lg:mb-24 text-creambg">
        Synth<span className="text-richblack">Div</span>
      </h1>
      <PolynomialForm setDividend={setDividend} setDivisor={setDivisor} />
      <div className="flex space-x-4">
        <DivideButton onClick={handleDivide} />
        <button
          onClick={handleFindRoots}
          className="bg-cyan-900 w-24 h-10 sm:w-32 sm:h-12 text-white px-4 py-2 rounded-3xl mt-2"
        >
          Find Roots
        </button>
      </div>

      {tableData && (
        <div className="w-full sm:w-1/2 flex flex-col items-center">
          <h3 className="text-creambg font-bold italic mt-6">Dividend:</h3>
          <p>{dividendPolynomial?.toString()}</p>

          <ResultDisplay quotient={quotient} remainder={remainder} />
          <DivisionTable
            quotient={quotient}
            divisor={divisor}
            traceSteps={traceSteps}
          />
        </div>
      )}

      {roots.length > 0 && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-creambg italic">Roots:</h3>
          <p>{roots.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default Calculator;
