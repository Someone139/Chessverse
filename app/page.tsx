"use client";
import { useState, useEffect, useRef, JSX } from 'react';
import { Chess } from "chess.js";
import { ChessKing, ChessPawn, ChessBishop, ChessKnight, ChessQueen, ChessRook } from "lucide-react";
import { getBestMove } from "@/lib/stockfish";
import GameOverModal from "@/components/GameOverModal";
import PromotionModal from "@/components/PromotionModal";
import TopBar from "@/components/TopBar";
import ChessBoard from '@/components/ChessBoard';
import MoveHistory from '@/components/MoveHistory';
import GameTools from '@/components/GameTools';
import Timer from '@/components/Timer';
import HomePage from '@/components/HomePage';
import { useChessGame } from '@/components/useChessGame';

export default function Home() {
  const [page, setPage] = useState<string>("Home");

  const [game, setGame] = useState(new Chess());
  const gameRef = useRef(new Chess());
  const [history, setHistory] = useState<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const [turn, setTurn] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
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
          <TopBar
            setPage={setPage}
          />

          {/* Home Page */}
          <HomePage
            setPage={setPage}
          />
        </div>
      )}
      {page === "Game" && (
        <div className="grid grid-rows-[60px_1fr] min-h-screen min-w-screen text-white">
          {/* Top Bar */}
          <TopBar
            setPage={setPage}
          />

          <div className="grid grid-cols-3 h-[calc(100vh-60px)] gap-2 bg-gradient-to-b from-[#211832]/80 to-zinc-900/90 overflow-hidden">

            {/* Move History */}
            <MoveHistory
              moves={moves}
              setMoves={setMoves}
              gameRef={gameRef}
              syncUI={syncUI}
              setIsViewingHistory={setIsViewingHistory}
              setViewIndex={setViewIndex}
              viewIndex={viewIndex}
              getMoveSquares={getMoveSquares}
              atStart={atStart}
              atEnd={atEnd}
            />

            {/* Board Area */}
            <div className="grid grid-rows-[80px_1fr_80px] h-[95%] items-center self-center mb-1">
              {/* Top Timer */}
              <Timer
                whiteTime={whiteTime}
                blackTime={blackTime}
                setWhiteTime={setWhiteTime}
                setBlackTime={setBlackTime}
                boardOrientation={boardOrientation}
                atBottom={boardOrientation !== "white"}
              />
              {/* Board */}
              <ChessBoard
                game={game}
                gameRef={gameRef}
                boardOrientation={boardOrientation}
                captured={captured}
                getPieceSymbol={getPieceSymbol}
                makeMove={makeMove}
                onSquareClick={onSquareClick}
                lastMove={lastMove}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
              />
              <Timer
                whiteTime={whiteTime}
                blackTime={blackTime}
                setWhiteTime={setWhiteTime}
                setBlackTime={setBlackTime}
                boardOrientation={boardOrientation}
                atBottom={boardOrientation === "white"}
              />
            </div>
            {/* Game Tools */}
            <GameTools
              gameOver={gameOver}
              setGameOver={setGameOver}
              setShowModal={setShowModal}
              setStatus={setStatus}
              turn={turn}

              moves={moves}
              setMoves={setMoves}
              viewIndex={viewIndex}
              setViewIndex={setViewIndex}
              setIsViewingHistory={setIsViewingHistory}

              gameRef={gameRef}
              syncUI={syncUI}

              boardOrientation={boardOrientation}
              setBoardOrientation={setBoardOrientation}
            />
          </div>
        </div>
      )}
      {showPromotion && (
        <PromotionModal
          showPromotion={showPromotion}
          handlePromotion={handlePromotion}
        />
      )}
      {status && showModal && (
        <GameOverModal
          status={status}
          showModal={showModal}
          newGame={newGame}
        />
      )}
    </main>
  );
}