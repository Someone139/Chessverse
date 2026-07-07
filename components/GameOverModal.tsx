import { BookOpenCheck, RotateCw, SquarePlus } from "lucide-react";

type Props = {
  status: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  newGame: () => void;
  mutedStatus: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export default function GameOverModal({
  status,
  showModal,
  setShowModal,
  newGame,
  mutedStatus,
  setPage,
}: Props) {
  if (!showModal || !status) return null;

  return (
    <div className="fixed flex flex-col self-center left-1/2 -translate-x-1/2 items-center z-50 rounded-xl bg-background-100 w-120 h-130 shadow-2xl border border-border">
        <div className="flex flex-col p-2 border-b border-border w-full rounded-t-xl bg-secondary-100">
          <p className="text-3xl font-bold text-center text-text-950">{status}</p>
          <p className="text-xl font-semibold text-center text-text-700">{mutedStatus}</p>
        </div>
        {/* Space for extra things e.g. coach later on */}
        <div className="flex flex-col p-2 border-t gap-2 items-center justify-center border-border w-full mt-auto rounded-b-xl bg-secondary-100">
          <button
          onClick={() => {
            setPage("GameReview")
            setShowModal(false)
          }}
          className="flex gap-1 bg-primary-400 rounded-lg py-2.5 w-[60%] items-center justify-center cursor-pointer hover:bg-primary-500 hover:scale-102 transition-all duration-200"
          >
          <BookOpenCheck size={35} />
          <p className="text-2xl font-semibold">Game Review</p>
          </button>
          <div className="flex justify-between w-full px-5">
            <button
            onClick={newGame}
            className="flex gap-1 bg-secondary-400 items-center rounded-lg py-2.5 px-4 cursor-pointer hover:bg-secondary-500 hover:scale-102 transition-all duration-200"
            >
            <SquarePlus size={35} />
            <p className="text-xl font-semibold">New Game</p>
            </button>
            <button
            onClick={newGame}
            className="flex gap-1 bg-secondary-400 items-center rounded-lg py-2.5 px-4 cursor-pointer hover:bg-secondary-500 hover:scale-102 transition-all duration-200"
            >
            <RotateCw size={35} />
            <p className="text-xl font-semibold">Rematch</p>
            </button>
          </div>
        </div>
    </div>
  );
}