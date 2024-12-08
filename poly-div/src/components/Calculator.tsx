import { useState } from "react";
import Polynomial from "polynomial";
import { derivative, evaluate } from "mathjs"; // Import mathjs
import PolynomialForm from "./PolynomialForm";
import DivideButton from "./DivideButton";
import ResultDisplay from "./ResultDisplay";
import DivisionTable from "./DivisionTable";
import nerdamer from "nerdamer";

function Calculator() {
  const [dividend, setDividend] = useState<string>("");
  const [divisor, setDivisor] = useState<string>("");
  const [quotient, setQuotient] = useState<string>("");
  const [remainder, setRemainder] = useState<string>("");
  const [traceSteps, setTraceSteps] = useState<string[]>([]);
  const [tableData, setTableData] = useState<boolean>(false);
  const [dividendPolynomial, setDividedPolynomial] = useState<Polynomial>();
  const [roots, setRoots] = useState<string[]>([]);

  const handleDivide = () => {
    try {
      if (!dividend || !divisor) {
        alert("Please enter both dividend and divisor.");
        return;
      }
      const parsedDividend = JSON.parse(dividend);
      (Polynomial as any).trace = true;
      const dividendPoly = new Polynomial(parsedDividend);
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
      setDividedPolynomial(dividendPoly);
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
      if (!dividendPolynomial) {
        alert("Please calculate the dividend polynomial first.");
        return;
      }

      // Extract coefficients from the Polynomial object
      const coeff = dividendPolynomial.coeff as Record<string, number>;
      const maxDegree = Math.max(...Object.keys(coeff).map(Number));
      let coefficients: number[] = Array.from(
        { length: maxDegree + 1 },
        (_, i) => coeff[i] || 0
      );

      console.log("Polynomial Coefficients:", coefficients);

      const tolerance: number = 1e-7; // Convergence tolerance
      const maxIterations: number = 100; // Maximum number of iterations per root
      const roots: number[] = []; // Store found roots

      while (coefficients.length > 1) {
        const root = findRoot(coefficients, tolerance, maxIterations);
        if (root === null) {
          break; // Stop if no root is found
        }
        roots.push(root);

        // Deflate the polynomial by dividing by (x - root)
        coefficients = deflatePolynomial(coefficients, root);
      }

      setRoots(roots.map((r) => r.toFixed(6))); // Store roots rounded to 6 decimal places

      if (roots.length === 0) {
        alert("No roots found.");
      } else {
        console.log("Roots Found:", roots);
      }
    } catch (error) {
      alert("Error finding roots. Please check your polynomial.");
      console.log("Error:", error);
    }
  };

  // Newton-Raphson Method for Root Finding
  const findRoot = (
    coefficients: number[],
    tolerance: number,
    maxIterations: number
  ): number | null => {
    let x = 0; // Initial guess
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const fx = evaluatePolynomial(coefficients, x);
      const fPrimeX = evaluateDerivative(coefficients, x);

      if (Math.abs(fPrimeX) < tolerance) {
        console.log("Derivative too small, stopping.");
        return null;
      }

      const xNext = x - fx / fPrimeX;

      if (Math.abs(xNext - x) < tolerance) {
        return xNext; // Converged
      }

      x = xNext;
    }

    console.log("Newton-Raphson did not converge.");
    return null;
  };

  // Evaluate the Polynomial at a Given Value
  const evaluatePolynomial = (coefficients: number[], x: number): number => {
    return coefficients.reduce(
      (sum, coeff, i) => sum + coeff * Math.pow(x, coefficients.length - i - 1),
      0
    );
  };

  // Evaluate the Derivative of the Polynomial at a Given Value
  const evaluateDerivative = (coefficients: number[], x: number): number => {
    return coefficients
      .map((coeff, i) => coeff * (coefficients.length - i - 1))
      .slice(0, -1)
      .reduce(
        (sum, coeff, i) =>
          sum + coeff * Math.pow(x, coefficients.length - i - 2),
        0
      );
  };

  // Deflate the Polynomial After Finding a Root
  const deflatePolynomial = (
    coefficients: number[],
    root: number
  ): number[] => {
    const newCoefficients: number[] = [];
    let remainder = 0;

    for (let i = 0; i < coefficients.length; i++) {
      const current = coefficients[i] + remainder;
      newCoefficients.push(current);
      remainder = current * root;
    }

    newCoefficients.pop(); // Remove the last remainder term
    return newCoefficients;
  };

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
