"use client";

import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import ReviewBoard from "@/components/ReviewBoard";
import ReviewMoveHistory from "@/components/ReviewMoveHistory";
import EvaluationBar from "@/components/EvaluationBar";
import { analysePositions } from "@/lib/stockfish";
import { getOpeningFromMoves, isBookMove } from "@/lib/getOpening";

type MoveQuality =
    | "Brilliant"
    | "Critical"
    | "Best"
    | "Excellent"
    | "Good"
    | "Inaccuracy"
    | "Mistake"
    | "Blunder"
    | "Miss"
    | "Forced"
    | "Book"
    | "Missed Win"
    | "Unknown";

type Props = {
  moves: string[];
  getPieceSymbol: (p: string) => React.ReactNode;
};

export default function GameReview({
  moves,
  getPieceSymbol,
}: Props) {
    const [evaluations, setEvaluations] = useState<{
        score: number;
        mate: number | null;
        bestMove: string;
    }[]>([]);

    const [analysing, setAnalysing] = useState(true);
    const [currentMove, setCurrentMove] = useState(moves.length);
    const [winner, setWinner] = useState<number>(0);
    const hasAnalysed = useRef(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [dots, setDots] = useState(0);
    const [moveQualities, setMoveQualities] = useState<MoveQuality[]>([]);
    const [openingName, setOpeningName] = useState<string>("Unknown");

    const [lastMove, setLastMove] = useState<{
        from: string;
        to: string;
    } | null>(null);

    const [captured, setCaptured] = useState<{
        w: string[];
        b: string[];
    }>({
        w: [],
        b: [],
    });

    const game = new Chess();

    for (let i = 0; i < currentMove; i++) {
        game.move(moves[i]);
    }

    const currentEvaluation = evaluations[currentMove];

    function rebuildCaptured(game: Chess) {
        const capturedByWhite: string[] = [];
        const capturedByBlack: string[] = [];

        const history = game.history({ verbose: true });

        for (const move of history) {
            if (move.captured) {
            if (move.color === "w") {
                capturedByWhite.push(move.captured);
            } else {
                capturedByBlack.push(move.captured);
            }
            }
        }

        const pieceOrder = {
            q: 5,
            r: 4,
            b: 3,
            n: 2,
            p: 1,
        };

        capturedByWhite.sort(
            (a, b) => pieceOrder[b as keyof typeof pieceOrder] - pieceOrder[a as keyof typeof pieceOrder]
        );

        capturedByBlack.sort(
            (a, b) => pieceOrder[b as keyof typeof pieceOrder] - pieceOrder[a as keyof typeof pieceOrder]
        );

        setCaptured({
            w: capturedByBlack,
            b: capturedByWhite,
        });
    }

    function uciToSan(uci: string, fen: string) {
        const game = new Chess(fen);

        const move = game.move({
            from: uci.slice(0, 2),
            to: uci.slice(2, 4),
            promotion: uci.slice(4, 5) || undefined,
        });

        return move?.san ?? uci;
    }

    function evaluationToWinChance(score: number) {
        const cp = score * 100;
        return (
            0.5 + 0.5 * ((2 / (1 + Math.exp(-0.004 * cp))) - 1)
        );
    }

    function classifyMiss(
        opponentBefore: number,
        opponentAfter: number,
        playerAfter: number,
        player: "w" | "b"
    ): boolean {

        const advantageGained =
            player === "w"
                ? opponentAfter - opponentBefore
                : opponentBefore - opponentAfter;


        const advantageLost =
            player === "w"
                ? opponentAfter - playerAfter
                : playerAfter - opponentAfter;


        if (advantageGained < 1.5) {
            return false;
        }

        if (advantageLost < 1) {
            return false;
        }

        if (player === "w" && playerAfter > 3) return false;
        if (player === "b" && playerAfter < -3) return false;

        return true;
    }

    function classifyMove(
        before: number,
        after: number,
        mateBefore: number | null,
        mateAfter: number | null,
        bestMove: string,
        playedMove: string,
        turn: "w" | "b"
    ): MoveQuality {
        // Checkmate move
        if (mateBefore !== null || mateAfter !== null) {
            const winningForPlayer = (mate: number) =>
                (turn === "w" && mate > 0) ||
                (turn === "b" && mate < 0);

            // Found a mate
            if (mateBefore === null && mateAfter !== null) {
                return winningForPlayer(mateAfter) ? "Best" : "Blunder";
            }

            // Lost a mate
            if (mateBefore !== null && mateAfter === null) {
                return winningForPlayer(mateBefore) ? "Missed Win" : "Blunder";
            }

            if (mateBefore !== null && mateAfter !== null) {
                const beforeWinning = winningForPlayer(mateBefore);
                const afterWinning = winningForPlayer(mateAfter);

                // Mate switched sides
                if (beforeWinning !== afterWinning) {
                    return afterWinning ? "Best" : "Blunder";
                }

                const beforeDist = Math.abs(mateBefore);
                const afterDist = Math.abs(mateAfter);

                if (afterWinning) {
                    if (afterDist <= beforeDist - 1) return "Best";
                    if (afterDist > beforeDist) return "Excellent";
                } else {
                    if (afterDist >= beforeDist - 1) return "Best";
                    if (afterDist < beforeDist - 1) return "Excellent";
                }
            }
        }

        const beforeChance = evaluationToWinChance(before);
        const afterChance = evaluationToWinChance(after);

        const loss =
            turn === "w"
                ? beforeChance - afterChance
                : afterChance - beforeChance;

        if (playedMove === bestMove) return "Best";
        if (loss <= 0.035) return "Excellent";
        if (loss <= 0.07) return "Good";
        if (loss <= 0.1) return "Inaccuracy";
        if (loss <= 0.2) return "Mistake";
        if (loss <= 1) return "Blunder";

        return "Unknown";
    }

    useEffect(() => {
        if (hasAnalysed.current) return;

        hasAnalysed.current = true;

        async function analyse() {
            setAnalysing(true);

            const game = new Chess();

            const fens: string[] = [
                game.fen()
            ];

            for (const move of moves) {
                game.move(move);
                fens.push(game.fen());
            }

            const finalGame = new Chess();

            for (const move of moves) {
                finalGame.move(move);
            }

            let winnerValue = 0;
            let finalMate = false;

            if (finalGame.isCheckmate()) {
                finalMate = true;

                winnerValue =
                    finalGame.turn() === "w"
                        ? -1
                        : 1;

                setWinner(winnerValue);

                fens.pop();
            }

            const result = await analysePositions(
                fens,
                (current, total) => {
                    setAnalysisProgress(Math.round((current / total) * 100));
                }
            );

            const correctedResult =
                result.map((evaluation, index) => {
                    const tempGame = new Chess();

                    for (let i = 0; i < index; i++) {
                        tempGame.move(moves[i]);
                    }

                    if (tempGame.turn() === "b") {
                        return {
                            score: evaluation.score * -1,
                            mate: evaluation.mate
                                ? evaluation.mate * -1
                                : null,
                            bestMove: evaluation.bestMove,
                        };
                    }

                    return {
                        score: evaluation.score,
                        mate: evaluation.mate,
                        bestMove: evaluation.bestMove,
                    };
                });

            if (finalMate) {
                correctedResult.push({
                    score:
                        winnerValue === 1
                            ? 100
                            : -100,
                    mate:
                        winnerValue === 1
                            ? 1
                            : -1,
                    bestMove: "",
                });
            }

            setEvaluations(correctedResult);
            const qualities: MoveQuality[] = [];

            for (let i = 1; i < correctedResult.length; i++) {
                const turn = i % 2 === 1 ? "w" : "b";

                const tempGame = new Chess();

                for (let j = 0; j < i - 1; j++) {
                    tempGame.move(moves[j]);
                }

                const fenBefore = tempGame.fen();

                if (tempGame.moves().length === 1) {
                    qualities.push("Forced");
                    continue;
                }

                if (i <= 20 && isBookMove(moves.slice(0, i))) {
                    qualities.push("Book");
                    continue;
                }

                if (i >= 2) {
                    const player = i % 2 === 1 ? "w" : "b";

                    const missed = classifyMiss(
                        correctedResult[i - 2].score,
                        correctedResult[i - 1].score,
                        correctedResult[i].score,
                        player
                    );

                    if (missed) {
                        qualities.push("Miss");
                        continue;
                    }
                }

                const playedMove = (() => {
                    const temp = new Chess();

                    for (let j = 0; j < i - 1; j++) {
                        temp.move(moves[j]);
                    }

                    const move = temp.move(moves[i - 1]);

                    return move.from + move.to + (move.promotion ?? "");
                })();

                qualities.push(
                    classifyMove(
                        correctedResult[i - 1].score,
                        correctedResult[i].score,
                        correctedResult[i - 1].mate,
                        correctedResult[i].mate,
                        correctedResult[i - 1].bestMove,
                        playedMove,
                        turn,
                    )
                );
            }

            setMoveQualities(qualities);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setAnalysing(false);
        }


        analyse();

    }, [moves]);

    useEffect(() => {
        if (currentMove === 0) {
            setOpeningName("Starting Position");
            return;
        }

        const opening = getOpeningFromMoves(
            moves.slice(0, currentMove)
        );

        setOpeningName(opening?.name ?? "Unknown");

    }, [currentMove, moves.join(",")]);

    useEffect(() => {
        rebuildCaptured(game);
    }, [currentMove]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 350);

        return () => clearInterval(interval);
    }, []);

    if (analysing) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 bg-background-50">     
                <p className="text-2xl text-text-950">
                    Analysing game{".".repeat(dots)}
                </p>

                <div className="w-64 h-3 rounded-full overflow-hidden bg-background-200">
                    <div
                        className="relative h-full overflow-hidden transition-all duration-500 ease-out"
                        style={{
                            width: `${analysisProgress}%`,
                        }}
                    >
                        <div
                            className="absolute -left-8 top-0 h-full w-[calc(100%+32px)] animate-stripes"
                            style={{
                                backgroundImage: "repeating-linear-gradient(135deg, var(--accent-800) 0px, var(--accent-800) 10px, var(--accent-500) 10px, var(--accent-500) 20px)",
                                backgroundSize: "28px 28px"
                            }}
                        />
                    </div>
                </div>

                <p className="text-lg text-text-700">
                    {analysisProgress}%
                </p>

            </div>
        );
    }

    if (!currentEvaluation) {
        return null;
    }

    return (
        <div className="grid grid-cols-3 h-[calc(100vh-65px)] gap-2 items-center bg-background-50 overflow-hidden">

            {/* Move History */}
            <ReviewMoveHistory
                moves={moves}
                currentMove={currentMove}
                setCurrentMove={setCurrentMove}
                setLastMove={setLastMove}
            />

            {/* Board */}
            <div className="flex h-[500px] w-[540px] items-center gap-2">
                <EvaluationBar
                    evaluation={currentEvaluation.score}
                    mate={currentEvaluation.mate}
                    winner={currentMove === evaluations.length - 1 ? winner : 0}
                />
                <ReviewBoard
                    game={game}
                    boardOrientation="white"
                    lastMove={lastMove}
                    captured={captured}
                    getPieceSymbol={getPieceSymbol}
                />
            </div>

            {/* Evaluation */}
            <div className="flex flex-col items-center">
                <h2 className="text-xl">
                    Move Analysis
                </h2>

                <p>
                    {moveQualities[currentMove - 1] ?? "No analysis"}
                </p>
                <p>
                    {openingName}
                </p>
                <p>
                    {currentMove > 0
                        ? `The best move was: ${uciToSan(
                            evaluations[currentMove - 1]?.bestMove,
                            (() => {
                                const tempGame = new Chess();

                                for (let i = 0; i < currentMove - 1; i++) {
                                    tempGame.move(moves[i]);
                                }

                                return tempGame.fen();
                            })()
                        )}`
                        : "No move yet"
                    }
                </p>
            </div>

        </div>
    );
}