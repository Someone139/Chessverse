"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

type Props = {
    game: Chess;
    boardOrientation: "white" | "black";
    lastMove: { from: string; to: string; } | null;
    captured: {
        w: string[];
        b: string[];
    };
    getPieceSymbol: (p: string) => React.ReactNode;
};

export default function ReviewBoard({
  game,
  boardOrientation,
  lastMove,
  captured,
  getPieceSymbol,
}: Props) {
  return (
    <div className="flex flex-col w-[500px] h-[540px] shadow-2xl">
        <div className="flex w-full h-[20px]">
            {boardOrientation === "black" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.b.map((p, i) => (
                <span key={i} className="text-lg opacity-80 text-text-950">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
            {boardOrientation === "white" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.w.map((p, i) => (
                <span key={i} className="text-lg opacity-80 text-text-950">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
        </div>
        <Chessboard
            options={{
                boardOrientation,
                position: game.fen(),
                squareStyles: {
                    ...(lastMove
                        ? {
                            [lastMove.from]: {
                                backgroundColor: "rgba(215, 219, 127, 0.5)",
                            },
                            [lastMove.to]: {
                                backgroundColor: "rgba(215, 219, 127, 0.5)",
                            },
                        }
                        : {}),
                },
            }}
        />
        <div className="flex w-full h-[20px]">
            {boardOrientation === "white" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.b.map((p, i) => (
                <span key={i} className="text-lg opacity-80 text-text-950">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
            {boardOrientation === "black" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.w.map((p, i) => (
                <span key={i} className="text-lg opacity-80 text-text-950">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
        </div>
    </div>
  );
}