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
    <div className="grid grid-cols-3 w-[500px] h-[80px] bg-[#412B6B] items-center rounded-xl">
      
      {/* Left label */}
      <div className="flex text-center justify-self-start ml-5">
        <ChessKing size={40} className="self-center -mt-2" />
        <p className="text-2xl font-semibold self-center ml-2">
          {atBottom === true ? "White" : "Black"}
        </p>
      </div>

      {/* Timer */}
      <p className="text-4xl font-semibold justify-self-center self-center">
        {atBottom === true
          ? formatTime(whiteTime)
          : formatTime(blackTime)}
      </p>

      {/* Add time */}
      {atBottom === true ? (
        <button
          onClick={() => setWhiteTime((t) => t + 15)}
          className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
        >
          <Plus size={40} color="#211832" />
        </button>
      ) : (
        <button
          onClick={() => setBlackTime((t) => t + 15)}
          className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
        >
          <Plus size={40} color="#211832" />
        </button>
      )}
    </div>
  );
}