"use client";
import { useState, useEffect, useRef, JSX } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [promotionMove, setPromotionMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const {
    game,
    gameRef,
    moves,
    setMoves,
    setHistory,
    viewIndex,
    setViewIndex,

    turn,
    status,
    setStatus,

    selectedSquare,
    legalMoves,

    lastMove,
    captured,

    whiteTime,
    setWhiteTime,
    blackTime,
    setBlackTime,

    aiCancelledRef,

    syncUI,
    updateCaptured,
    rebuildCaptured,
    updateGameState,
    newGame,
    getMoveSquares,
    onSquareClick,
    makeMove,
    handlePromotion,
  } = useChessGame({
    promotionMove,
    setShowPromotion,

    setPromotionMove,

    gameOver,
    setGameOver,

    setShowModal,

    setIsViewingHistory,
  });
  const [page, setPage] = useState<string>("Home");

  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const moveHistoryRef = useRef<HTMLDivElement>(null);
  const currentIndex = viewIndex !== null ? viewIndex : moves.length - 1;
  const atStart = currentIndex <= -1;
  const atEnd = currentIndex >= moves.length - 1;

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
    const container = moveHistoryRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [moves]);

  useEffect(() => {
    if (gameOver) return;
    if (isViewingHistory) return;
    if (viewIndex !== null) return;
    if (turn !== "b") return;

    aiCancelledRef.current = false;

    const timeout = setTimeout(async () => {
      if (aiCancelledRef.current) return;

      const moveStr = await getBestMove(gameRef.current.fen());
      if (!moveStr) return;

      if (aiCancelledRef.current) return;

      const from = moveStr.slice(0, 2);
      const to = moveStr.slice(2, 4);
      const promotion = moveStr.length === 5 ? moveStr[4] : undefined;

      const validatedMove = gameRef.current.move({ 
        from, 
        to, 
        promotion: promotion
      });

      updateCaptured(validatedMove);

      if (!validatedMove) return;

      if (aiCancelledRef.current) return;

      syncUI(gameRef.current, { from, to });
      
      setHistory(prev => [...prev, gameRef.current.fen()]);
      setMoves(prev => [...prev, validatedMove.san]);

      updateGameState();
    }, 500);

    return () => {
      clearTimeout(timeout);
      aiCancelledRef.current = true;
    }
  }, [turn, gameOver]);

  return (
    <main className="flex min-h-screen text-white justify-center">
      {page === "Home" && (
        <div className="min-h-screen min-w-screen grid grid-rows-[70px_1fr]">
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
        <div className="grid grid-rows-[70px_1fr] min-h-screen min-w-screen">
          {/* Top Bar */}
          <TopBar
            setPage={setPage}
          />

          <div className="grid grid-cols-3 h-[calc(100vh-70px)] gap-2 bg-background-50 overflow-hidden">
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
              moveHistoryRef={moveHistoryRef}
              rebuildCaptured={rebuildCaptured}
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
            {/* div this and place the GameOverModal underneath */}
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

              aiCancelledRef={aiCancelledRef}

              rebuildCaptured={rebuildCaptured}
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