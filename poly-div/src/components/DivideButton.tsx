interface DivideButtonProps {
    onClick: () => void;
  }
  
  const DivideButton: React.FC<DivideButtonProps> = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="bg-lime-600 w-32 h-12 text-white px-4 py-2 rounded-3xl mt-2"
      >
        Divide
      </button>
    );
  };
  
  export default DivideButton;
  