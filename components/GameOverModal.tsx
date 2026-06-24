import { SquarePlus } from "lucide-react";

type GameOverModalProps = {
  status: string;
  showModal: boolean;
  newGame: () => void;
};

export default function GameOverModal({
  status,
  showModal,
  newGame,
}: GameOverModalProps) {
  if (!showModal || !status) return null;

  return (
    <div className="fixed flex flex-col justify-between items-center p-5 top-[40%] left-[50%] -translate-x-1/2 z-50 rounded-xl bg-primary-400 w-200 h-60 shadow-2xl border border-[#5C3E94]">
        <p className="text-4xl font-bold text-center">{status}</p>
        <button
        onClick={newGame}
        className="flex gap-1 shadow bg-[#F25912] rounded-lg py-2.5 px-4 cursor-pointer hover:bg-[#5C3E94] hover:shadow-[#F25912]/80 hover:scale-102 transition-all duration-200"
        >
        <SquarePlus size={40} />
        <p className="text-xl font-semibold mt-1.5">New Game</p>
        </button>
    </div>
  );
}