interface DivideButtonProps {
  onClick: () => void;
}

const DivideButton: React.FC<DivideButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-paynegray w-24 h-10 sm:w-32 sm:h-12 text-white px-4 py-2 rounded-3xl mt-2"
    >
      Divide
    </button>
  );
};

export default DivideButton;
