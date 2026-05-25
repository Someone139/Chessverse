"use client";
import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Swords, Clock, ChessKing, Puzzle, BookOpen, ChartNoAxesCombined, Trophy, Settings } from "lucide-react";

export default function Home() {
  const [page, setPage] = useState<string>("Home");
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
    if (gameOver || page !== "Game") return;

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
  }, [turn, gameOver, page]);

  return (
    <main className="flex min-h-screen text-white justify-center">
      {page === "Home" && (
        <div className="min-h-screen min-w-screen grid grid-rows-[60px_1fr]">
          {/* Top Bar */}
          <header className="flex justify-between items-center gap-2 min-w-screen px-4 h-[60px] border-b-2 border-zinc-950 bg-gradient-to-b from-[#412B6B]/80 to-purple-950/90">
            <div className="flex items-center ml-2">
              {/* Button to home page */}
              <button
              onClick={() => setPage("Home")}
              className="flex gap-1.5 cursor-pointer py-3 px-1 rounded-lg"
              >
                <ChessKing size={30} className="-mt-0.5"/>
                <div className="font-bold text-2xl">
                  Chessverse
                </div>
              </button>
            </div>
            {/* Other buttons */}
            <div className="flex items-center gap-5 mr-10">
              {/* Play button */}
              <button
              onClick={() => setPage("Game")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <Swords size={18} className="mt-[5px]"/>
                <p className="text-lg font-semibold">Play</p>
              </button>
              {/* Puzzles */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <Puzzle size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Puzzles</p>
              </button>
              {/* Learn */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <BookOpen size={18} className="mt-[5px]"/>
                <p className="text-lg font-semibold">Learn</p>
              </button>
              {/* Stats */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <ChartNoAxesCombined size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Statistics</p>
              </button>
              {/* Leaderboard */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <Trophy size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Leaderboard</p>
              </button>
              {/* Settings */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3"
              >
                <Settings size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Settings</p>
              </button>
            </div>

          </header>
          <div className="text-center space-y-1 pt-5 bg-gradient-to-b from-[#211832]/80 to-zinc-900/90">
            <h1 className="text-5xl font-bold">Hello, this website is under development please save and check again later.</h1>
            <p className="text-zinc-400">
              Your move.
            </p>
            <button
            onClick={() => setPage("Game")}
            className="mt-4 inline-block text-center rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-300 transition-colors"
            >
              Play Now
            </button>
          </div>
        </div>
      )}
      {page === "Game" && (
        <div className="flex flex-col gap-2 min-h-screen min-w-screen items-center justify-center text-white bg-zinc-900">
          <div className="w-[400px] text-center">
            {page === "Game" && status && (
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