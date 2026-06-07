"use client";
import { useState, useEffect, Fragment, useRef, JSX } from 'react';
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Swords, ChessKing, Puzzle, BookOpen, ChartNoAxesCombined, Trophy, Settings, User, Users, Bot, Plus, Flag, Handshake, Undo2, RefreshCcw, SquarePlus, ChevronLast, ChevronFirst, ChevronRight, ChevronLeft, ChessPawn, ChessBishop, ChessKnight, ChessQueen, ChessRook } from "lucide-react";
import { getBestMove } from "@/lib/stockfish";

export default function Home() {
  const [page, setPage] = useState<string>("Home");
  const [game, setGame] = useState(new Chess());
  const gameRef = useRef(new Chess());
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [promotionPiece, setPromotionPiece] = useState("q");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [gameOver, setGameOver] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [showPromotion, setShowPromotion] = useState(false);
  const moveHistoryRef = useRef<HTMLDivElement>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const currentIndex = viewIndex !== null ? viewIndex : moves.length - 1;
  const atStart = currentIndex <= -1;
  const atEnd = currentIndex >= moves.length - 1;
  const [captured, setCaptured] = useState<{
    w: string[];
    b: string[];
  }>({
    w: [],
    b: [],
  });
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [promotionMove, setPromotionMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  function syncUI(game: Chess, lastMove?: { from: string; to: string } | null) {
    setGame(new Chess(game.fen()));
    setTurn(game.turn());
    setLastMove(lastMove ?? null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }

  function getMoveSquares(moveIndex: number) {
    const replay = new Chess();

    let lastMove = null;

    for (let i = 0; i <= moveIndex; i++) {
      lastMove = replay.move(moves[i]);
    }

    if (!lastMove) return null;

    return {
      from: lastMove.from,
      to: lastMove.to,
    };
  }

  function updateCaptured(move: any) {
    if (move.captured) {
      setCaptured(prev => {
        if (move.color === "w") {
          return {
            ...prev,
            b: [...prev.b, move.captured],
          };
        } else {
          return {
            ...prev,
            w: [...prev.w, move.captured],
          };
        }
      });
    }
  }

  function updateGameState(gameCopy: Chess) {
    if (gameCopy.isCheckmate()) {
      setGameOver(true);
      setShowModal(true);
      setStatus(
        `Checkmate! ${gameCopy.turn() === "w" ? "Black" : "White"} wins!`
      );
    }
    else if (gameCopy.isCheck()) {
      setStatus(
        `${gameCopy.turn() === "w" ? "White" : "Black"} is in check.`
      );
    }
    else if (gameCopy.isDraw()) {
      setGameOver(true);
      setShowModal(true);
      setStatus("Draw!");
    }
    else {
      setStatus("");
    }
  }

  function getPieceSymbol(p: string): React.ReactNode {
    const base = "w-4 h-4 opacity-80";

    const map: Record<string, JSX.Element> = {
      p: <ChessPawn className={base} />,
      r: <ChessRook className={base} />,
      n: <ChessKnight className={base} />,
      b: <ChessBishop className={base} />,
      q: <ChessQueen className={base} />,
      k: <ChessKing className={base} />,
    };

    return map[p];
  }

  function getLegalMoves(square: string) {
    const moves = game.moves({
      square: square as any,
      verbose: true,
    });

    return moves.map((m) => m.to);
  }

  function applyMove(from: string, to: string) {
    const gameCopy = gameRef.current;

    const move = gameCopy.move({
      from,
      to,
      promotion: promotionPiece,
    });

    updateCaptured(move);

    if (!move) return false;

    setViewIndex(null);

    gameRef.current = gameCopy;

    syncUI(gameCopy, {
      from: move.from,
      to: move.to,
    });

    setHistory(prev => [...prev, gameCopy.fen()]);
    setMoves(prev => [...prev, move.san]);
    
    updateGameState(gameCopy);

    return true;
  } 

  function onSquareClick({ square }: { square: string; piece?: any }) {
    const pieceObj = gameRef.current.get(square as any);

    if (!selectedSquare) {
      if (pieceObj && pieceObj.color === turn) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMoves(square));
      }
      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (legalMoves.includes(square)) {
      applyMove(selectedSquare, square);
      return;
    }

    if (pieceObj && pieceObj.color === turn) {
      setSelectedSquare(square);
      setLegalMoves(getLegalMoves(square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }

  function makeMove(args: {
    sourceSquare: string;
    targetSquare: string | null;
    piece: string;
  }): boolean {
    const { sourceSquare, targetSquare } = args;

    setSelectedSquare(null);
    setLegalMoves([]);

    if (!targetSquare) return false;
    if (gameOver) return false;

    const piece = gameRef.current.get(sourceSquare as any);
    if (!piece) return false;

    const isWhitePiece = piece.color === "w";

    if ((turn === "w" && !isWhitePiece) || (turn === "b" && isWhitePiece)) {
      return false;
    }

    const movesList = gameRef.current.moves({
      square: sourceSquare as any,
      verbose: true,
    });

    const match = movesList.find(m => m.to === targetSquare);

    if (!match) return false;

    const isPromotion = match.piece === "p" && (match.to[1] === "8" || match.to[1] === "1");

    if (isPromotion) {
      setPromotionMove({ from: sourceSquare, to: targetSquare });
      setShowPromotion(true);
      return false;
    }

    if (viewIndex !== null) {
      const newMoves = moves.slice(0, viewIndex + 1);

      const replay = new Chess();

      for (let i = 0; i < newMoves.length; i++) {
        replay.move(newMoves[i]);
      }

      gameRef.current = replay;

      setMoves(newMoves);
      setViewIndex(null);
      setIsViewingHistory(false);
    }

    return applyMove(sourceSquare, targetSquare);
  }

function newGame() {
  const freshGame = new Chess();

  gameRef.current = freshGame;

  setGame(new Chess());

  setHistory([]);
  setMoves([]);
  setViewIndex(null);
  setIsViewingHistory(false);

  setWhiteTime(600);
  setBlackTime(600);

  setGameOver(false);
  setStatus("");
  setTurn("w");
  setShowModal(false);

  setSelectedSquare(null);
  setLegalMoves([]);
  setLastMove(null);

  setShowPromotion(false);
  setPromotionMove(null);

  setBoardOrientation("white");
}

  function handlePromotion(piece: string) {
    if (!promotionMove) return;

    const gameCopy = gameRef.current;

    const move = gameCopy.move({
      from: promotionMove.from,
      to: promotionMove.to,
      promotion: piece,
    });

    updateCaptured(move);

    if (!move) return;

    gameRef.current = gameCopy;

    syncUI(gameCopy, {
      from: move.from,
      to: move.to,
    });

    gameRef.current = gameCopy;

    setGame(new Chess(gameCopy.fen()));
    setHistory(prev => [...prev, gameCopy.fen()]);

    setLastMove({ from: move.from, to: move.to });

    setTurn(gameCopy.turn());

    updateGameState(gameCopy);

    setShowPromotion(false);
    setPromotionMove(null);
  }

  useEffect(() => {
    if (gameOver || page !== "Game") return;

    const interval = setInterval(() => {
      if (turn === "w") {
        setWhiteTime((time) => {
          if (time <= 0) {
            setStatus("Time's up! Black wins!");
            setGameOver(true);
            setShowModal(true)
            return 0;
          }
          return time - 1;
        });
      } else {
        setBlackTime((time) => {
          if (time <= 0) {
            setStatus("Time's up! White wins!");
            setGameOver(true);
            setShowModal(true)
            return 0;
          }
          return time - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, gameOver, page]);

  useEffect(() => {
    if (!moveHistoryRef.current) return;

    moveHistoryRef.current.scrollTo({
      top: moveHistoryRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [moves]);

  useEffect(() => {
    if (gameOver) return;
    if (isViewingHistory) return;
    if (turn !== "b") return;

    const timeout = setTimeout(async () => {
      const moveStr = await getBestMove(gameRef.current.fen());
      if (!moveStr) return;

      const from = moveStr.slice(0, 2);
      const to = moveStr.slice(2, 4);
      const promotion = moveStr.length === 5 ? moveStr[4] : undefined;

      const validatedMove = gameRef.current.move({ 
        from, 
        to, 
        promotion: promotion || "q" 
      });

      updateCaptured(validatedMove);

      if (!validatedMove) return;

      syncUI(gameRef.current, { from, to });
      
      setHistory(prev => [...prev, gameRef.current.fen()]);
      setMoves(prev => [...prev, validatedMove.san]);

      updateGameState(gameRef.current);
    }, 500);

    return () => clearTimeout(timeout);
  }, [turn, gameOver]);

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
                <p className="text-zinc-200 -mt-1">Your move.</p>
              </div>
              <div className="grid grid-cols-4 text-center items-center justify-center space-x-10 px-10">
                {/* Quick Play */}
                <button
                onClick={() => setPage("Game")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#F25912] py-10 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
                >
                  <Swords size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Quick Play</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Jump into a game</p>
                </button>
                {/* Play with Friends */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
                >
                  <Users size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Play with Friends</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Challenge a friend</p>
                </button>
                {/* Play with AI */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
                >
                  <Bot size={45} color='#211832' className="mb-3"/>
                  <h2 className="font-semibold text-2xl">Play vs AI</h2>
                  <p className="text-xs text-zinc-200 mt-1.5">Train against AI</p>
                </button>
                {/* Puzzles */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
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
        <div className="grid grid-rows-[60px_1fr] min-h-screen min-w-screen text-white">
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

          <div className="grid grid-cols-3 h-[calc(100vh-60px)] gap-2 bg-gradient-to-b from-[#211832]/80 to-zinc-900/90 overflow-hidden">
            {/* Move History */}
            <div className="m-5 w-[400px] rounded-xl bg-[#412B6B] p-4 overflow-hidden flex flex-col h-[95%]">
              <h2 className="mb-2 text-3xl font-bold self-center justify-self-center">
                Move History
              </h2>

              <div className="mt-5 text-white overflow-y-auto flex-1 pr-2 min-h-0">
                <div className="grid grid-cols-[40px_1fr_1fr] auto-rows-min gap-y-1.5 gap-x-1.5 mt-5 text-white overflow-y-auto flex-1 pr-2 min-h-0 content-start p-1">
                  {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, index) => (
                    <Fragment key={index}>
                      
                      {/* index */}
                      <div className="bg-[#5C3E94] pl-1 shadow w-full px-2 flex items-center h-8 rounded-sm">
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

                        setViewIndex(clickedIndex);
                      }}
                      className={`bg-[#5C3E94] pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm cursor-pointer hover:bg-[#5C3E94]/50 transition-all duration-200 ${
                        viewIndex === index * 2 ||
                        (viewIndex === null && index * 2 === moves.length - 1)
                          ? "ring-2 ring-[#F25912]"
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
                          
                          setViewIndex(clickedIndex);
                        }}
                      className={`bg-[#5C3E94] pl-2 shadow w-full px-2 flex items-center h-8 rounded-sm cursor-pointer hover:bg-[#5C3E94]/50 transition-all duration-200 ${
                        viewIndex === index * 2 + 1 ||
                        (viewIndex === null && index * 2 + 1 === moves.length - 1)
                          ? "ring-2 ring-[#F25912]"
                          : ""
                      }`}
                      >
                        {moves[index * 2 + 1] || ""}
                      </button>

                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-3 w-full mt-2¬">
                <button
                disabled={atStart}
                onClick={() => {
                  setIsViewingHistory(true);
                  setViewIndex(-1);

                  const replay = new Chess();

                  syncUI(replay, null)
                }}
                className="bg-[#5C3E94] p-3 shadow shadow-black/50 rounded-lg cursor-pointer hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5C3E94] disabled:hover:shadow-black/50"
                >
                  <ChevronFirst size={40}/>
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
                }}
                className="bg-[#5C3E94] p-3 shadow shadow-black/50 rounded-lg cursor-pointer hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5C3E94] disabled:hover:shadow-black/50"
                >
                  <ChevronLeft size={40}/>
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
                }}
                className="bg-[#5C3E94] p-3 shadow shadow-black/50 rounded-lg cursor-pointer hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5C3E94] disabled:hover:shadow-black/50"
                >
                  <ChevronRight size={40}/>
                </button>

                <button
                disabled={atEnd}
                onClick={() => {
                  setIsViewingHistory(false);
                  setViewIndex(null);

                  const moveSquares =
                    moves.length > 0
                      ? getMoveSquares(moves.length - 1)
                      : null;

                  syncUI(
                    new Chess(gameRef.current.fen()),
                    moveSquares
                  );
                }}
                className="bg-[#5C3E94] p-3 shadow shadow-black/50 rounded-lg cursor-pointer hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5C3E94] disabled:hover:shadow-black/50"
                >
                  <ChevronLast size={40}/>
                </button>
              </div>
            </div>
            {/* Board */}
            <div className="grid grid-rows-[80px_1fr_80px] h-full items-center">
              <div className="grid grid-cols-3 w-[500px] h-[80px] bg-[#412B6B] items-center rounded-xl mt-10">
                <div className="flex text-center justify-self-start ml-5">
                  <ChessKing size={40} className="self-center -mt-2"/>
                  {boardOrientation === "white" && (
                    <p className="text-2xl font-semibold self-center ml-2">
                      Black
                    </p>
                  )}
                  {boardOrientation === "black" && (
                    <p className="text-2xl font-semibold self-center ml-2">
                      White
                    </p>
                  )}
                </div>
                {boardOrientation === "white" && (
                  <p className="text-4xl font-semibold justify-self-center self-center">
                    {String(Math.floor(blackTime / 60)).padStart(2, "0")}:
                    {String(blackTime % 60).padStart(2, "0")}
                  </p>
                )}
                {boardOrientation === "black" && (
                  <p className="text-4xl font-semibold justify-self-center self-center">
                    {String(Math.floor(whiteTime / 60)).padStart(2, "0")}:
                    {String(whiteTime % 60).padStart(2, "0")}
                  </p>
                )}
                {boardOrientation === "white" && (
                  <button
                  onClick={() => setBlackTime(blackTime + 15)}
                  className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
                  >
                    <Plus size={40} color="#211832" className="self-center justify-self-center"/>
                  </button>
                )}
                {boardOrientation === "black" && (
                  <button
                  onClick={() => setWhiteTime(whiteTime + 15)}
                  className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
                  >
                    <Plus size={40} color="#211832" className="self-center justify-self-center"/>
                  </button>
                )}
              </div>
              <div className="flex flex-col w-[500px] h-[540px] shadow-2xl">
                <div className="flex w-full h-[20px]">
                  {boardOrientation === "black" &&
                    <div className="flex gap-0.5 h-[20px] flex-nowrap">
                      {captured.w.map((p, i) => (
                        <span key={i} className="text-lg opacity-80">
                          {getPieceSymbol(p)}
                        </span>
                      ))}
                    </div>
                  }
                  {boardOrientation === "white" &&
                    <div className="flex gap-0.5 h-[20px] flex-nowrap">
                      {captured.b.map((p, i) => (
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
                      {captured.w.map((p, i) => (
                        <span key={i}>
                          {getPieceSymbol(p)}
                        </span>
                      ))}
                    </div>
                  }
                  {boardOrientation === "black" &&
                    <div className="flex gap-0.5 h-[20px] flex-nowrap">
                      {captured.b.map((p, i) => (
                        <span key={i}>
                          {getPieceSymbol(p)}
                        </span>
                      ))}
                    </div>
                  }
                </div>
              </div>
              <div className="grid grid-cols-3 w-[500px] h-[80px] bg-[#412B6B] items-center rounded-xl mb-10">
                <div className="flex text-center justify-self-start ml-5">
                  <ChessKing size={40} className="self-center -mt-2"/>
                  {boardOrientation === "white" && (
                    <p className="text-2xl font-semibold self-center ml-2">
                      White
                    </p>
                  )}
                  {boardOrientation === "black" && (
                    <p className="text-2xl font-semibold self-center ml-2">
                      Black
                    </p>
                  )}
                </div>
                {boardOrientation === "black" && (
                  <p className="text-4xl font-semibold justify-self-center self-center">
                    {String(Math.floor(blackTime / 60)).padStart(2, "0")}:
                    {String(blackTime % 60).padStart(2, "0")}
                  </p>
                )}
                {boardOrientation === "white" && (
                  <p className="text-4xl font-semibold justify-self-center self-center">
                    {String(Math.floor(whiteTime / 60)).padStart(2, "0")}:
                    {String(whiteTime % 60).padStart(2, "0")}
                  </p>
                )}
                {boardOrientation === "black" && (
                  <button
                  onClick={() => setBlackTime(blackTime + 15)}
                  className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
                  >
                    <Plus size={40} color="#211832" className="self-center justify-self-center"/>
                  </button>
                )}
                {boardOrientation === "white" && (
                  <button
                  onClick={() => setWhiteTime(whiteTime + 15)}
                  className="bg-[#5C3E94] rounded-lg shadow items-center justify-center self-center justify-self-end cursor-pointer w-10 h-10 mr-5 hover:scale-105 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
                  >
                    <Plus size={40} color="#211832" className="self-center justify-self-center"/>
                  </button>
                )}
              </div>
            </div>
            {/* Game Tools */}
            <div className="m-5 w-[400px] rounded-xl bg-[#412B6B] p-4 overflow-hidden flex flex-col justify-self-end self-start gap-2">
              <h2 className="mb-2 text-3xl font-bold self-center justify-self-center">
                Game Tools
              </h2>

              {/* Resign */}
              <button
              onClick={() => {
                if (!gameOver) {
                  setGameOver(true);
                  setShowModal(true)
                  setStatus(turn === "w"
                    ? "White resigned. Black wins!"
                    : "Black resigned. White wins!"
                  );
                }
              }}
              className="flex items-center shadow justify-center bg-[#5C3E94] rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-[#FF0000]/80 transition-all duration-200"
              >
                <Flag size={30} />
                <p>Resign</p>
              </button>

              {/* Draw */}

              <button
              onClick={() => {
                setGameOver(true);
                setShowModal(true);
                setStatus("Draw agreed.");
              }}
              className="flex items-center shadow justify-center bg-[#5C3E94] rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
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
              }}
              className="flex items-center shadow justify-center bg-[#5C3E94] rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
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
              className="flex items-center shadow justify-center bg-[#5C3E94] rounded-lg p-4 cursor-pointer space-x-1 hover:scale-102 hover:bg-[#5C3E94]/50 hover:shadow-[#F25912]/80 transition-all duration-200"
              >
                <RefreshCcw size={30} className="mb-1"/>
                <p>Flip Board</p>
              </button>
            </div>
          </div>
        </div>
      )}
      {showPromotion && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#412B6B] rounded-xl p-6 flex gap-4 shadow-2xl">
            <button
              onClick={() => handlePromotion("q")}
              className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
            >
              Queen
            </button>

            <button
              onClick={() => handlePromotion("r")}
              className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
            >
              Rook
            </button>

            <button
              onClick={() => handlePromotion("b")}
              className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
            >
              Bishop
            </button>

            <button
              onClick={() => handlePromotion("n")}
              className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
            >
              Knight
            </button>
          </div>
        </div>
      )}
      {status && showModal && (
        <div className="fixed flex flex-col justify-between items-center p-5 top-[40%] left-[50%] -translate-x-1/2 z-50 rounded-xl bg-[#412B6B] w-200 h-60 shadow-2xl border border-[#5C3E94]">
          <p className="text-4xl font-bold text-center">{status}</p>
          <button
          onClick={newGame}
          className="flex gap-1 shadow bg-[#F25912] rounded-lg py-2.5 px-4 cursor-pointer hover:bg-[#5C3E94] hover:shadow-[#F25912]/80 hover:scale-102 transition-all duration-200"
          >
            <SquarePlus size={40} />
            <p className="text-xl font-semibold mt-1.5">New Game</p>
          </button>
        </div>
      )}
    </main>
  );
}