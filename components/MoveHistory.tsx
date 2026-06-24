import { Chess } from "chess.js";
import { Fragment } from "react";
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from "lucide-react"

type Props = {
  moves: string[];
  setMoves: React.Dispatch<React.SetStateAction<string[]>>;
  gameRef: React.RefObject<Chess>;
  syncUI: (game: Chess, lastMove?: { from: string; to: string } | null) => void;
  setIsViewingHistory: (v: boolean) => void;
  setViewIndex: (v: number | null) => void;
  viewIndex: number | null;
  getMoveSquares: (i: number) => { from: string; to: string } | null;
  atStart: boolean;
  atEnd: boolean;
  moveHistoryRef: React.RefObject<HTMLDivElement | null>;
  rebuildCaptured: (game: Chess) => void;
};

export default function MoveHistory({
    moves,
    setMoves,
    gameRef,
    syncUI,
    setIsViewingHistory,
    setViewIndex,
    viewIndex,
    getMoveSquares,
    atStart,
    atEnd,
    moveHistoryRef,
    rebuildCaptured,
}: Props) {
    return(
        <div className="m-5 w-[400px] rounded-xl bg-background-100 p-4 overflow-hidden flex flex-col h-[95%]">
            <h2 className="mb-2 text-3xl text-text-950 font-bold self-center justify-self-center">
            Move History
            </h2>

            <div
            ref={moveHistoryRef}
            className="mt-5 text-text-900 overflow-y-auto flex-1 pr-2 min-h-0"
            >
                <div className="grid grid-cols-[40px_1fr_1fr] auto-rows-min gap-y-1.5 gap-x-1.5 mt-5 overflow-y-auto flex-1 pr-2 min-h-0 content-start p-1">
                    {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, index) => (
                    <Fragment key={index}>
                        
                        {/* index */}
                        <div className="bg-secondary-400 pl-1 shadow w-full px-2 flex items-center h-8 rounded-sm">
                        {index + 1}.
                        </div>

                        {/* white */}
                        <button
                        onClick={() => {
                        const clickedIndex = index * 2;

                        const replay = new Chess();

                        for (let i = 0; i <= clickedIndex; i++) {
                            replay.move(moves[i]);
                        }

                        setIsViewingHistory(true);

                        gameRef.current = replay;

                        const moveSquares = getMoveSquares(clickedIndex);
                        syncUI(replay, moveSquares);
                        rebuildCaptured(replay);

                        setViewIndex(clickedIndex);
                        }}
                        className={`bg-secondary-400 pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm cursor-pointer hover:bg-secondary-500 transition-all duration-200 ${
                        viewIndex === index * 2 ||
                        (viewIndex === null && index * 2 === moves.length - 1)
                            ? "ring-2 ring-accent-500"
                            : ""
                        }`}
                        >
                        {moves[index * 2]}
                        </button>

                        {/* black */}
                        <button
                        onClick={() => {
                            const clickedIndex = index * 2 + 1;

                            const replay = new Chess();

                            for (let i = 0; i <= clickedIndex; i++) {
                                replay.move(moves[i]);
                            }

                            setIsViewingHistory(true);

                            gameRef.current = replay;

                            const moveSquares = getMoveSquares(clickedIndex);

                            syncUI(replay, moveSquares);
                            rebuildCaptured(replay);
                            
                            setViewIndex(clickedIndex);
                        }}
                        className={`bg-secondary-400 pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm cursor-pointer hover:bg-secondary-500 transition-all duration-200 ${
                        viewIndex === index * 2 + 1 ||
                        (viewIndex === null && index * 2 + 1 === moves.length - 1)
                            ? "ring-2 ring-accent-500"
                            : ""
                        }`}
                        >
                        {moves[index * 2 + 1] || ""}
                        </button>

                    </Fragment>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-3 w-full mt-2">
            <button
            disabled={atStart}
            onClick={() => {
                setIsViewingHistory(true);
                setViewIndex(-1);

                const replay = new Chess();

                syncUI(replay, null)
                rebuildCaptured(replay)
            }}
            className="bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg cursor-pointer hover:bg-secondary-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50 disabled:hover:shadow-black/50"
            >
                <ChevronFirst size={40} className="text-text-950"/>
            </button>

            <button
            disabled={atStart}
            onClick={() => {
                const currentIndex =
                viewIndex !== null ? viewIndex : moves.length - 1;

                if (currentIndex <= -1) return;

                const newIndex = currentIndex - 1;

                setIsViewingHistory(true);
                setViewIndex(newIndex);

                const replay = new Chess();

                for (let i = 0; i <= newIndex; i++) {
                replay.move(moves[i]);
                }

                const moveSquares = newIndex >= 0 ? getMoveSquares(newIndex) : null;

                syncUI(replay, moveSquares);
                rebuildCaptured(replay);
            }}
            className="bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg cursor-pointer hover:bg-secondary-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50 disabled:hover:shadow-black/50"
            >
                <ChevronLeft size={40} className="text-text-950"/>
            </button>

            <button
            disabled={atEnd}
            onClick={() => {
                const currentIndex =
                viewIndex !== null ? viewIndex : -1;

                if (currentIndex >= moves.length - 1) return;

                const newIndex = currentIndex + 1;

                setIsViewingHistory(true);
                setViewIndex(newIndex);

                const replay = new Chess();

                for (let i = 0; i <= newIndex; i++) {
                replay.move(moves[i]);
                }

                const moveSquares = getMoveSquares(newIndex);

                syncUI(replay, moveSquares);
                rebuildCaptured(replay);
            }}
            className="bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg cursor-pointer hover:bg-secondary-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50 disabled:hover:shadow-black/50"
            >
                <ChevronRight size={40} className="text-text-950"/>
            </button>

            <button
            disabled={atEnd}
            onClick={() => {
                setIsViewingHistory(false);
                setViewIndex(null);

                const replay = new Chess();

                for (const san of moves) {
                    replay.move(san);
                }

                gameRef.current = replay;

                const moveSquares =
                    moves.length > 0
                        ? getMoveSquares(moves.length - 1)
                        : null;

                syncUI(replay, moveSquares);
                rebuildCaptured(replay);
            }}
            className="bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg cursor-pointer hover:bg-secondary-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50 disabled:hover:shadow-black/50"
            >
                <ChevronLast size={40} className="text-text-950"/>
            </button>
            </div>
        </div>
    )
}