import { Chess } from "chess.js";
import { Flag, Handshake, Undo2, RefreshCcw } from 'lucide-react'

type Props = {
  gameOver: boolean;
  setGameOver: (v: boolean) => void;
  setShowModal: (v: boolean) => void;
  setStatus: (v: string) => void;
  setMutedStatus: React.Dispatch<React.SetStateAction<string>>;
  turn: "w" | "b";

  moves: string[];
  setMoves: React.Dispatch<React.SetStateAction<string[]>>;
  viewIndex: number | null;
  setViewIndex: (v: number | null) => void;
  setIsViewingHistory: (v: boolean) => void;

  gameRef: React.RefObject<Chess>;
  syncUI: (game: Chess, lastMove?: { from: string; to: string } | null) => void;

  boardOrientation: "white" | "black";
  setBoardOrientation: (v: "white" | "black") => void;
  aiCancelledRef: React.RefObject<boolean>;
  rebuildCaptured: (game: Chess) => void;
};

export default function GameTools({
    gameOver,
    setGameOver,
    setShowModal,
    setStatus,
    setMutedStatus,
    turn,

    moves,
    setMoves,
    viewIndex,
    setViewIndex,
    setIsViewingHistory,

    gameRef,
    syncUI,

    boardOrientation,
    setBoardOrientation,
    aiCancelledRef,
    rebuildCaptured,
}: Props) {
    return(
        <div className="w-[400px] rounded-xl bg-background-100 h-full p-3 overflow-hidden flex flex-col justify-self-end self-start gap-3">
            <h2 className="text-3xl font-bold self-center justify-self-center">
                Game Tools
            </h2>

            {/* Resign */}
            <button
            onClick={() => {
            if (!gameOver) {
                aiCancelledRef.current = true;
                setGameOver(true);
                setShowModal(true)
                setStatus(turn === "w"
                ? "Black wins!"
                : "White wins!"
                );
                setMutedStatus("by resignation");
            }
            }}
            className="flex items-center shadow justify-center bg-secondary-400 rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-[#ff0000] transition-all duration-200"
            >
                <Flag size={30} />
                <p>Resign</p>
            </button>

            {/* Draw */}

            <button
            onClick={() => {
            if (!gameOver) {
                aiCancelledRef.current = true;
                setGameOver(true);
                setShowModal(true);
                setStatus("Draw");
                setMutedStatus("by agreement");
            }
            }}
            className="flex items-center shadow justify-center bg-secondary-400 rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-secondary-500 transition-all duration-200"
            >
                <Handshake size={30} />
                <p>Offer Draw</p>
            </button>

            {/* Take back */}

            <button
            onClick={() => {
            if (gameOver) return;

            const targetIndex =
                viewIndex !== null ? viewIndex : moves.length - 1;

            if (targetIndex < 0) return;

            const pairStart =
                targetIndex % 2 === 0
                ? targetIndex
                : targetIndex - 1;

            const newMoves = moves.slice(0, pairStart);

            const replay = new Chess();

            for (let i = 0; i < newMoves.length; i++) {
                replay.move(newMoves[i]);
            }

            setIsViewingHistory(false);

            gameRef.current = replay;
            setMoves(newMoves);
            setViewIndex(null);

            syncUI(replay, null);
            rebuildCaptured(replay)
            }}
            className="flex items-center shadow justify-center bg-secondary-400 rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-secondary-500 transition-all duration-200"
            >
                <Undo2 size={30} className="mb-1.5"/>
                <p>Take Back</p>
            </button>

            {/* Flip board */}

            <button
            onClick={() =>
            setBoardOrientation(
                boardOrientation === "white" ? "black" : "white"
            )
            }
            className="flex items-center shadow justify-center bg-secondary-400 rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-secondary-500 transition-all duration-200"
            >
                <RefreshCcw size={30} className="mb-1"/>
                <p>Flip Board</p>
            </button>
        </div>
    )
}