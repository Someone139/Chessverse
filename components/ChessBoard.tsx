"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

type Props = {
  game: Chess;
  gameRef: React.RefObject<Chess>;
  boardOrientation: "white" | "black";
  captured: { w: string[]; b: string[] };
  getPieceSymbol: (p: string) => React.ReactNode;
  makeMove: any;
  onSquareClick: any;
  lastMove: any;
  selectedSquare: string | null;
  legalMoves: string[];
};

export default function ChessBoard({
  game,
  gameRef,
  boardOrientation,
  captured,
  getPieceSymbol,
  makeMove,
  onSquareClick,
  lastMove,
  selectedSquare,
  legalMoves,
}: Props) {
  return (
    <div className="flex flex-col w-[500px] h-[540px] shadow-2xl">
        <div className="flex w-full h-[20px]">
            {boardOrientation === "black" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.b.map((p, i) => (
                <span key={i} className="text-lg opacity-80">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
            {boardOrientation === "white" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.w.map((p, i) => (
                <span key={i} className="text-lg opacity-80">
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
        </div>
        <Chessboard
            options={{
            boardOrientation: boardOrientation,
            position: game.fen(),
            onPieceDrop: makeMove as any,
            onSquareClick: onSquareClick,
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
                ...(selectedSquare
                ? {
                    [selectedSquare]: {
                        backgroundColor: "rgba(215, 219, 127, 0.5)",
                    },
                    }
                : {}),
                ...legalMoves.reduce((acc, sq) => {
                const isCapture = game.get(sq as any);
                acc[sq] = {
                    background: isCapture
                    ? `
                        radial-gradient(circle,
                        transparent 0%,
                        transparent 47%,
                        rgba(0, 0, 0, 0.35) 40%,
                        rgba(0, 0, 0, 0.35) 60%,
                        transparent 61%
                        )
                    `
                    : `
                        radial-gradient(circle,
                        rgba(0, 0, 0, 0.35) 25%,
                        transparent 26%
                        )
                    `,
                };
                return acc;
                }, {} as Record<string, any>),
            }
            }}
        />
        <div className="flex w-full h-[20px] mt-0.5">
            {boardOrientation === "white" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.b.map((p, i) => (
                <span key={i}>
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
            {boardOrientation === "black" &&
            <div className="flex gap-0.5 h-[20px] flex-nowrap">
                {captured.w.map((p, i) => (
                <span key={i}>
                    {getPieceSymbol(p)}
                </span>
                ))}
            </div>
            }
        </div>
    </div>
  );
}