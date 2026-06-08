"use client";

import { useState, useRef } from "react";
import { Chess } from "chess.js";

export function useChessGame() {
  const [game, setGame] = useState(new Chess());
  const gameRef = useRef(new Chess());

  const [moves, setMoves] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const [turn, setTurn] = useState<"w" | "b">("w");
  const [status, setStatus] = useState("");

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const [captured, setCaptured] = useState<{
    w: string[];
    b: string[];
  }>({ w: [], b: [] });

  // SYNC UI FUNCTION
  function syncUI(gameInstance: Chess, move?: { from: string; to: string } | null) {
    setGame(new Chess(gameInstance.fen()));
    setTurn(gameInstance.turn());
    setLastMove(move ?? null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }

  // UPDATE CAPTURED PIECES
  function updateCaptured(move: any) {
    if (!move?.captured) return;

    setCaptured(prev => {
      if (move.color === "w") {
        return { ...prev, b: [...prev.b, move.captured] };
      } else {
        return { ...prev, w: [...prev.w, move.captured] };
      }
    });
  }

  // APPLY MOVES
  function applyMove(from: string, to: string, promotion = "q") {
    const gameCopy = gameRef.current;

    const move = gameCopy.move({ from, to, promotion });
    if (!move) return false;

    updateCaptured(move);

    gameRef.current = gameCopy;

    syncUI(gameCopy, { from: move.from, to: move.to });

    setMoves(prev => [...prev, move.san]);
    setHistory(prev => [...prev, gameCopy.fen()]);

    return true;
  }

  // LEGAL MOVES
  function getLegalMoves(square: string) {
    return gameRef.current
      .moves({ square: square as any, verbose: true })
      .map(m => m.to);
  }

  // UPDATE GAME STATE
  function updateGameState() {
    const g = gameRef.current;

    if (g.isCheckmate()) {
      setStatus(`Checkmate! ${g.turn() === "w" ? "Black" : "White"} wins!`);
    } else if (g.isCheck()) {
      setStatus(`${g.turn() === "w" ? "White" : "Black"} is in check.`);
    } else if (g.isDraw()) {
      setStatus("Draw!");
    } else {
      setStatus("");
    }
  }

  // RESET GAME
  function newGame() {
    const fresh = new Chess();

    gameRef.current = fresh;
    setGame(new Chess());

    setMoves([]);
    setHistory([]);
    setViewIndex(null);

    setTurn("w");
    setStatus("");

    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);

    setCaptured({ w: [], b: [] });
  }

  return {
    // state
    game,
    gameRef,
    moves,
    setMoves,
    history,
    setHistory,
    viewIndex,
    setViewIndex,

    turn,
    status,
    setStatus,

    selectedSquare,
    setSelectedSquare,
    legalMoves,
    setLegalMoves,

    lastMove,
    captured,

    // logic
    syncUI,
    applyMove,
    getLegalMoves,
    updateCaptured,
    updateGameState,
    newGame,
  };
}