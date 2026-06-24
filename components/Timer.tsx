import { Plus, ChessKing } from "lucide-react";

type Props = {
  whiteTime: number;
  blackTime: number;

  setWhiteTime: (t: number | ((t: number) => number)) => void;
  setBlackTime: (t: number | ((t: number) => number)) => void;

  boardOrientation: "white" | "black";
  atBottom: boolean;
};

export default function Timer({
  whiteTime,
  blackTime,

  setWhiteTime,
  setBlackTime,

  boardOrientation,
  atBottom,
}: Props) {
  function formatTime(time: number) {
    return (
      String(Math.floor(time / 60)).padStart(2, "0") +
      ":" +
      String(time % 60).padStart(2, "0")
    );
  }

  return (
    <div className="grid grid-cols-3 w-[500px] h-[80px] bg-background-100 items-center rounded-xl">
      
      {/* Left label */}
      <div className="flex text-center justify-self-start ml-5">
        <ChessKing size={40} className="self-center -mt-2 text-text-950" />
        <p className="text-2xl font-semibold self-center ml-2 text-text-950">
          {atBottom === true ? "White" : "Black"}
        </p>
      </div>

      {/* Timer */}
      <p className="text-4xl font-semibold justify-self-center self-center text-text-950">
        {atBottom === true
          ? formatTime(whiteTime)
          : formatTime(blackTime)}
      </p>

      {/* Add time */}
      {atBottom === true ? (
        <button
          onClick={() => setWhiteTime((t) => t + 15)}
          className="bg-secondary-400 rounded-lg items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:bg-secondary-500 transition-all duration-200"
        >
          <Plus size={40} className="text-background-50" />
        </button>
      ) : (
        <button
          onClick={() => setBlackTime((t) => t + 15)}
          className="bg-secondary-400 rounded-lg items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:bg-secondary-500 transition-all duration-200"
        >
          <Plus size={40} className="text-background-50" />
        </button>
      )}
    </div>
  );
}