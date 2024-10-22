import { useState, useEffect } from "react";

interface PolynomialFormProps {
  setDividend: (value: string) => void;
  setDivisor: (value: string) => void;
}

interface Monomial {
  coefficient: string;
  degree: string;
}

const PolynomialForm: React.FC<PolynomialFormProps> = ({
  setDividend,
  setDivisor,
}) => {
  // Default monomials for dividend (degree 2 polynomial) and divisor (x + 1)
  const [dividendMonomials, setDividendMonomials] = useState<Monomial[]>([
    { coefficient: "1", degree: "0" },
    { coefficient: "1", degree: "1" },
    { coefficient: "1", degree: "2" },
  ]);

  const [divisor, setDivisorInput] = useState<string>("x+1"); // Default divisor is x + 1

  // Automatically update dividend whenever user changes it
  useEffect(() => {
    const dividendObject: Record<string, string> = {};
    dividendMonomials.forEach(({ coefficient, degree }) => {
      if (coefficient && degree) {
        dividendObject[degree] = coefficient;
      }
    });

    // Update the dividend in the parent component
    setDividend(JSON.stringify(dividendObject));
  }, [dividendMonomials, setDividend]);

  // Automatically update divisor whenever the user changes it
  useEffect(() => {
    setDivisor(divisor);
  }, [divisor, setDivisor]);

  const handleAddMonomial = (setMonomials: React.Dispatch<React.SetStateAction<Monomial[]>>) => {
    setMonomials((prevMonomials) => [ ...prevMonomials, { coefficient: "1", degree: "1" },]);
  };

  const handleRemoveMonomial = (index: number) => {
    setDividendMonomials((prevMonomials) => prevMonomials.filter((_, i) => i !== index));
  };

  const handleMonomialChange = (
    index: number,
    field: "coefficient" | "degree",
    value: string,
    setMonomials: React.Dispatch<React.SetStateAction<Monomial[]>>
  ) => {
    setMonomials((prevMonomials) => {
      const newMonomials = [...prevMonomials];
      newMonomials[index][field] = value;
      return newMonomials;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 w-full flex flex-col items-center justify-center">
        <h3 className="text-xl text-creambg italic font-semibold mb-4 text-center">
          Enter Dividend Terms:
        </h3>
        {dividendMonomials.map((monomial, index) => (
          <div key={index} className="flex flex-col items-center mb-2 w-full">
              <div className="bg-prussianblue py-1 rounded-3xl flex w-1/2 flex-row justify-center items-center">
                <input
                  type="text"
                  placeholder="Coefficient"
                  value={monomial.coefficient}
                  onChange={(e) =>
                    handleMonomialChange(
                      index,
                      "coefficient",
                      e.target.value,
                      setDividendMonomials
                    )
                  }
                  className="text-center font-bold bg-creambg text-richblack rounded-3xl p-2 mr-2 w-1/5"
                />
                <span className="font-bold mr-2">x^</span>
                <input
                  type="text"
                  placeholder="Degree"
                  value={monomial.degree}
                  onChange={(e) =>
                    handleMonomialChange(
                      index,
                      "degree",
                      e.target.value,
                      setDividendMonomials
                    )
                  }
                  className="text-center font-bold bg-creambg text-richblack rounded-3xl p-2 mr-2 w-1/5"
                />
                {index >= 3 && (
                <button
                  onClick={() => handleRemoveMonomial(index)}
                  className="text-red-500 text-xs rounded-3xl h-full"
                  title="Remove Term"
                >
                  &#x2715;
                </button>
              )}
              </div>
            </div>
        ))}
        <button
          onClick={() => handleAddMonomial(setDividendMonomials)}
          className="bg-cyan-900 text-white px-4 py-2 rounded-3xl mt-2"
        >
          + Add Term
        </button>
      </div>

      <div className="mb-4 flex flex-col justify-between items-center">
        <h3 className="text-xl text-creambg italic font-semibold mb-4">
          Enter Divisor Polynomial:
        </h3>
        <input
          type="text"
          value={divisor}
          onChange={(e) => setDivisorInput(e.target.value)}
          className="rounded-3xl py-2 mt-2 w-2/3 text-start px-4 bg-prussianblue"
          placeholder="Enter the divisor polynomial (default is x + 1)"
        />
      </div>
    </div>
  );
};

export default PolynomialForm;
