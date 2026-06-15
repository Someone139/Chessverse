"use client";

import { useState, useRef } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";

export function useChessGame({
    promotionMove,
    setShowPromotion,

    setPromotionMove,

    gameOver,
    setGameOver,

    setShowModal,

    setIsViewingHistory,
}: any) {
    const [game, setGame] = useState(new Chess());
    const gameRef = useRef(new Chess());

    const aiCancelledRef = useRef<boolean>(false);

    const [moves, setMoves] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [viewIndex, setViewIndex] = useState<number | null>(null);

    const [turn, setTurn] = useState<"w" | "b">("w");
    const [status, setStatus] = useState("");

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);

    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);

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
        if (!move) return;

        rebuildCaptured(gameRef.current);
    }

    function rebuildCaptured(game: Chess) {
        const start = {
            p: 8,
            n: 2,
            b: 2,
            r: 2,
            q: 1,
        };
        const remainingWhite = { p: 0, r: 0, n: 0, b: 0, q: 0 };
        const remainingBlack = { p: 0, r: 0, n: 0, b: 0, q: 0 };
        for (const row of game.board()) {
            for (const piece of row) {
                if (!piece || piece.type === "k") continue;
                if (piece.color === "w") {
                    remainingWhite[piece.type]++;
                } else {
                    remainingBlack[piece.type]++;
                }
            }
        }
        const capturedByWhite: string[] = [];
        const capturedByBlack: string[] = [];
        for (const type of Object.keys(start) as Array<keyof typeof start>) {
            for (let i = 0; i < start[type] - remainingBlack[type]; i++) {
                capturedByWhite.push(type);
            }
            for (let i = 0; i < start[type] - remainingWhite[type]; i++) {
                capturedByBlack.push(type);
            }
        }
        setCaptured({
            w: capturedByBlack,
            b: capturedByWhite,
        });
    }

    // APPLY MOVES
    function applyMove(from: string, to: string, promotion?: string) {
        const gameCopy = gameRef.current;

        const piece = gameCopy.get(from as Square);

        const isPawn = piece?.type === "p";

        const isPromotionSquare =
        (piece?.color === "w" && to[1] === "8") ||
        (piece?.color === "b" && to[1] === "1");

        if (isPawn && isPromotionSquare && !promotion) {
            setPromotionMove({ from, to });
            setShowPromotion(true);
            return false;
        }

        const move = gameCopy.move({
            from,
            to,
            promotion
        });
        
        if (!move) return false;

        updateCaptured(move);

        gameRef.current = gameCopy;

        syncUI(gameCopy, { from: move.from, to: move.to });

        setMoves(prev => [...prev, move.san]);
        setHistory(prev => [...prev, gameCopy.fen()]);

        updateGameState()

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
            setGameOver(true);
            setShowModal(true);
            return;
        }

        if (g.isDraw()) {
            setStatus("Draw!");
            setGameOver(true);
            setShowModal(true);
            return;
        }

        if (g.isCheck()) {
            setStatus(`${g.turn() === "w" ? "White" : "Black"} is in check.`);
            return;
        }

        setStatus("");
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

        setShowModal(false)

        setWhiteTime(600);
        setBlackTime(600);

        setCaptured({ w: [], b: [] });

        setGameOver(false)
        aiCancelledRef.current = false;
    }

    // GET MOVE SQUARES
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

    // ON SQUARE CLICK
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
            applyMove(selectedSquare, square, undefined);
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

    // MAKE MOVE
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

        const isPromotion =
        match.piece === "p" &&
        ((match.color === "w" && match.to[1] === "8") ||
        (match.color === "b" && match.to[1] === "1"));

        if (isPromotion) {
            setPromotionMove({ from: sourceSquare, to: targetSquare });
            setShowPromotion(true);
            return false;
        }

        if (viewIndex !== null) {
            const trimmedMoves = moves.slice(0, viewIndex + 1);

            const replay = new Chess();

            for (const san of trimmedMoves) {
                replay.move(san);
            }

            gameRef.current = replay;

            setMoves(trimmedMoves);
            setHistory(trimmedMoves);

            setViewIndex(null);
            setIsViewingHistory(false);

            syncUI(replay, null);
        }

        return applyMove(sourceSquare, targetSquare);
    }

    // HANDLE PROMOTION
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

        setHistory(prev => [...prev, gameCopy.fen()]);

        updateGameState();

        setShowPromotion(false);
        setPromotionMove(null);
    }

  return {
    // state
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
    blackTime,
    setWhiteTime,
    setBlackTime,
    
    aiCancelledRef,

    // logic
    syncUI,
    updateCaptured,
    rebuildCaptured,
    updateGameState,
    newGame,
    getMoveSquares,
    onSquareClick,
    makeMove,
    handlePromotion,
  };
}