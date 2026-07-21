"use client";

import { Fragment, useEffect } from "react";
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from "lucide-react";
import { Chess } from "chess.js";

type Props = {
    moves: string[];
    currentMove: number;
    setCurrentMove: React.Dispatch<React.SetStateAction<number>>;
    setLastMove: React.Dispatch<

  React.SetStateAction<{ from: string; to: string; } | null>>;
};

export default function ReviewMoveHistory({
    moves,
    currentMove,
    setCurrentMove,
    setLastMove,
}: Props) {

    const atStart = currentMove <= 0;
    const atEnd = currentMove >= moves.length;

    function getLastMove(moveIndex: number) {
        if (moveIndex <= 0) return null;

        const replay = new Chess();

        let lastMove = null;

        for (let i = 0; i < moveIndex; i++) {
            lastMove = replay.move(moves[i]);
        }

        if (!lastMove) return null;

        return {
            from: lastMove.from,
            to: lastMove.to,
        };
    }

    function goToStart() {
        setCurrentMove(0)
        setLastMove(null)
    }

    function goPrevious() {
        const newMove = currentMove - 1;

        if (newMove >= 0) {
            setCurrentMove(newMove);
            setLastMove(getLastMove(newMove));
        }
    }

    function goNext() {
        const newMove = currentMove + 1;

        if (newMove <= moves.length) {
            setCurrentMove(newMove);
            setLastMove(getLastMove(newMove));
        }
    }

    function goToEnd() {
        const newMove = moves.length;

        setCurrentMove(newMove);
        setLastMove(getLastMove(newMove));
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    goPrevious();
                    break;

                case "ArrowRight":
                    e.preventDefault();
                    goNext();
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    goToStart();
                    break;

                case "ArrowDown":
                    e.preventDefault();
                    goToEnd();
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentMove, moves]);

    return (
        <div className="m-5 w-[400px] rounded-xl bg-background-100 p-4 overflow-hidden flex flex-col h-[95%]">

            <h2 className="mb-2 text-3xl text-text-950 font-bold self-center justify-self-center">
                Move History
            </h2>


            <div className="mt-5 text-text-900 overflow-y-auto flex-1 pr-2 min-h-0">

                <div className="grid grid-cols-[40px_1fr_1fr] auto-rows-min gap-y-1.5 gap-x-1.5 mt-5 overflow-y-auto flex-1 pr-2 min-h-0 content-start p-1">

                    {Array.from({
                        length: Math.ceil(moves.length / 2)
                    }).map((_, index) => (

                        <Fragment key={index}>

                            <div className="bg-secondary-400 pl-1 shadow w-full px-2 flex items-center h-8 rounded-sm">
                                {index + 1}.
                            </div>


                            <button
                            onClick={() => {
                                const moveIndex = index * 2 + 1;

                                setCurrentMove(moveIndex);
                                setLastMove(getLastMove(moveIndex));
                            }}
                            className={`
                                bg-secondary-400 pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm
                                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                                ${
                                    currentMove === index * 2 + 1
                                    ? "ring-2 ring-accent-500"
                                    : ""
                                }
                            `}
                            >
                                {moves[index * 2]}
                            </button>


                            <button
                            onClick={() => {
                                const moveIndex = index * 2 + 2;

                                setCurrentMove(moveIndex);
                                setLastMove(getLastMove(moveIndex));
                            }}
                            className={`
                                bg-secondary-400 pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm
                                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                                ${
                                    currentMove === index * 2 + 2
                                    ? "ring-2 ring-accent-500"
                                    : ""
                                }
                            `}
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
                onClick={goToStart}
                className="
                bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg
                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50
                "
                >
                    <ChevronFirst size={40} className="text-text-950"/>
                </button>


                <button
                disabled={atStart}
                onClick={goPrevious}
                className="
                bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg
                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50
                "
                >
                    <ChevronLeft size={40} className="text-text-950"/>
                </button>


                <button
                disabled={atEnd}
                onClick={goNext}
                className="
                bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg
                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50
                "
                >
                    <ChevronRight size={40} className="text-text-950"/>
                </button>


                <button
                disabled={atEnd}
                onClick={goToEnd}
                className="
                bg-secondary-400 p-3 shadow shadow-black/50 border border-border rounded-lg
                cursor-pointer hover:bg-secondary-500 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-500/50
                "
                >
                    <ChevronLast size={40} className="text-text-950"/>
                </button>


            </div>

        </div>
    );
}