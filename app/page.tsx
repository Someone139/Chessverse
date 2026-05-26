"use client";
import { useState, useEffect } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Swords, ChessKing, Puzzle, BookOpen, ChartNoAxesCombined, Trophy, Settings, User, Users, Bot } from "lucide-react";

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
            <div className="flex items-center gap-5">
              {/* Play button */}
              <button
              onClick={() => setPage("Game")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <Swords size={18} className="mt-[5px]"/>
                <p className="text-lg font-semibold">Play</p>
              </button>
              {/* Puzzles */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <Puzzle size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Puzzles</p>
              </button>
              {/* Learn */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <BookOpen size={18} className="mt-[5px]"/>
                <p className="text-lg font-semibold">Learn</p>
              </button>
              {/* Stats */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <ChartNoAxesCombined size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Statistics</p>
              </button>
              {/* Leaderboard */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <Trophy size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Leaderboard</p>
              </button>
              {/* Settings */}
              <button
              onClick={() => setPage("Home")}
              className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <Settings size={18} className="mt-[4px]"/>
                <p className="text-lg font-semibold">Settings</p>
              </button>
            </div>
            <div className="flex items-center ml-2">
              {/* Profile Button */}
              <button
              onClick={() => setPage("Home")}
              className="flex gap-1.5 bg-[#211832] cursor-pointer rounded-lg px-8 py-3 hover:bg-[#5C3E94] transition-colors"
              >
                <User size={30} className="-mt-0.5"/>
                <div className="font-semibold text-lg">
                  Profile
                </div>
              </button>
            </div>

          </header>
          <div className="grid grid-rows-2 text-center items-center bg-gradient-to-b from-[#211832]/80 to-zinc-900/90">
            <div className="grid grid-rows-2 text-center items-center space-y-5">
              <div className="flex flex-col text-center items-center justify-center">
                <ChessKing size={60} className="mb-2"/>
                <h1 className="font-bold text-6xl">Chessverse</h1>
                <p className="text-zinc-200 -mt-1">Your Move</p>
              </div>
              <div className="grid grid-cols-4 text-center items-center justify-center space-x-10 px-10">
                {/* Quick Play */}
                <button
                onClick={() => setPage("Game")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#F25912] py-10 rounded-xl"
                >
                  <Swords size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Quick Play</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Jump into a game</p>
                </button>
                {/* Play with Friends */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors"
                >
                  <Users size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Play with Friends</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Challenge a friend</p>
                </button>
                {/* Play with AI */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors"
                >
                  <Bot size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Play vs AI</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Train against AI</p>
                </button>
                {/* Puzzles */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors"
                >
                  <Swords size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Puzzles</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Solve and Improve</p>
                </button>
              </div>
            </div>
            <div className="flex flex-col text-center items-center">
              <h1 className="text-7xl">This website is under development. Please save the URL and check again later. One day, you might be playing chess here.</h1>
            </div>
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