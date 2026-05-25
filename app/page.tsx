"use client";
import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<string>("");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [promotionPiece, setPromotionPiece] = useState("q");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [gameOver, setGameOver] = useState(false);

  function makeMove(args: {
    sourceSquare: string;
    targetSquare: string | null;
    piece: string;
  }): boolean {
    const { sourceSquare, targetSquare } = args;

    if (!targetSquare) return false;

    const isWhitePiece = game.get(sourceSquare as any)?.color === "w";

    if ((turn === "w" && !isWhitePiece) || (turn === "b" && isWhitePiece)) {
      return false;
    }

    const gameCopy = new Chess(game.fen());

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionPiece,
    });

    if (!move) return false;

    setGame(gameCopy);

    setMoveHistory((prev) => [...prev, move.san]);

    if (gameCopy.isCheckmate()) {
      setStatus(`Checkmate! ${gameCopy.turn() === "w" ? "Black" : "White"} wins`);
    }
    else if (gameCopy.isCheck()) {
      setStatus(`${gameCopy.turn() === "w" ? "White" : "Black"} is in check`);
    }
    else if (gameCopy.isDraw()) {
      setStatus("Draw");
    }
    else {
      setStatus("");
    }

    setTurn(turn === "w" ? "b" : "w");

    return true;
  }

  useEffect(() => {
    if (gameOver || !started) return;

    const interval = setInterval(() => {
      if (turn === "w") {
        setWhiteTime((time) => {
          if (time <= 0) {
            setStatus("Time's up! Black wins");
            setGameOver(true);
            return 0;
          }
          return time - 1;
        });
      } else {
        setBlackTime((time) => {
          if (time <= 0) {
            setStatus("Time's up! White wins");
            setGameOver(true);
            return 0;
          }
          return time - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, gameOver, started]);

  return (
    <main className="flex min-h-screen bg-zinc-900 text-white justify-center">
      {!started && (
        <div className="text-center space-y-1 pt-5">
          <h1 className="text-5xl font-bold">Chessverse</h1>
          <p className="text-zinc-400">
            Your move.
          </p>
          <button
          onClick={() => setStarted(true)}
          className="mt-4 inline-block text-center rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-300 transition-colors"
          >
            Play Now
          </button>
        </div>
      )}
      {started && (
        <div className="flex flex-col gap-2 min-h-screen items-center justify-center text-white">
          <div className="w-[400px] text-center">
            {started && status && (
              <p className="mb-3 text-yellow-400 font-semibold">
                {status}
              </p>
            )}
          </div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setPromotionPiece("q")}
              className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600 transition-colors"
            >
              Queen
            </button>

            <button
              onClick={() => setPromotionPiece("r")}
              className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600 transition-colors"
            >
              Rook
            </button>

            <button
              onClick={() => setPromotionPiece("b")}
              className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600 transition-colors"
            >
              Bishop
            </button>

            <button
              onClick={() => setPromotionPiece("n")}
              className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600 transition-colors"
            >
              Knight
            </button>
          </div>
          <div className="mb-4 flex w-[400px] justify-between text-lg font-semibold">
            <div>
              White: {Math.floor(whiteTime / 60)}:
              {String(whiteTime % 60).padStart(2, "0")}
            </div>

            <div>
              Black: {Math.floor(blackTime / 60)}:
              {String(blackTime % 60).padStart(2, "0")}
            </div>
          </div>
          <div className="w-[400px] shadow-2xl">
            <Chessboard
              options={{
                boardOrientation: "white",
                position: game.fen(),
                onPieceDrop: makeMove as any,
              }}
            />
          </div>
          <div className="mt-4 w-[400px] rounded-xl bg-zinc-800 p-4">
            <h2 className="mb-2 text-lg font-bold">Move History</h2>

            <div className="grid grid-cols-2 gap-y-1 text-sm text-zinc-300">
              {moveHistory.map((move, index) => (
                <div key={index}>
                  {index + 1}. {move}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}