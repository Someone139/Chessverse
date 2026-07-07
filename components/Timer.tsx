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
  let limitTime: number = 10800;

  function formatTime(time: number) {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    const formattedHours = String(hours).padStart(2, "0")
    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(seconds).padStart(2, "0")

    return hours > 0
      ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedMinutes}:${formattedSeconds}`
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
          onClick={() => {
            if (whiteTime <= (limitTime - 15)){
              setWhiteTime((t) => t + 15)
            }
            else if (whiteTime > (limitTime - 15) && whiteTime <= limitTime){
              setWhiteTime(limitTime)
            }
          }}
          className="bg-secondary-400 rounded-lg items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:bg-secondary-500 transition-all duration-200"
        >
          <Plus size={40} className="text-background-50" />
        </button>
      ) : (
        <button
          onClick={() => {
            if (blackTime <= (limitTime - 15)){
              setBlackTime((t) => t + 15)
            }
            else if (blackTime > (limitTime - 15) && blackTime <= limitTime){
              setBlackTime(limitTime)
            }
          }}
          className="bg-secondary-400 rounded-lg items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:bg-secondary-500 transition-all duration-200"
        >
          <Plus size={40} className="text-background-50" />
        </button>
      )}
    </div>
  );
}