"use client";

import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import ReviewBoard from "@/components/ReviewBoard";
import ReviewMoveHistory from "@/components/ReviewMoveHistory";
import EvaluationBar from "@/components/EvaluationBar";
import { analysePositions } from "@/lib/stockfish";
import { getOpeningFromMoves, isBookMove } from "@/lib/getOpening";
import { RefreshCcw, Settings, Share2 } from "lucide-react";
import { BlunderIcon, BookIcon, BestMoveIcon, ExcellentMoveIcon, InaccuracyMoveIcon, GoodMoveIcon, MistakeMoveIcon, MissMoveIcon, MissedWinMoveIcon, ForcedMoveIcon, CriticalMoveIcon, BrilliantMoveIcon } from "./icons";

type MoveQuality =
    | "Brilliant"
    | "Critical"
    | "The Best Move"
    | "Excellent"
    | "Good"
    | "An Inaccuracy"
    | "A Mistake"
    | "A Blunder"
    | "A Miss"
    | "Forced"
    | "A Book Move"
    | "A Missed Win"
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

    const moveToColor: Record<string, string> = {
        "a book move": "text-[#C5A888]",
        "a blunder": "text-[#FF2220]",
        "the best move": "text-[#89C465]",
        "excellent": "text-[#89C465]",
        "an inaccuracy": "text-[#F4BB44]",
        "good": "text-[#8ea47c]",
        "a mistake": "text-[#ffa358]",
        "a miss": "text-[#ee6b55]",
        "a missed win": "text-[#F4BB44]",
        "forced": "text-[#8ea47c]",
        "critical": "text-[#85a7ca]",
        "brilliant": "text-[#2ec3ed]",
    };

    const moveToIcon: Record<string, React.ComponentType> = {
        "a book move": BookIcon,
        "a blunder": BlunderIcon,
        "the best move": BestMoveIcon,
        "excellent": ExcellentMoveIcon,
        "an inaccuracy": InaccuracyMoveIcon,
        "good": GoodMoveIcon,
        "a mistake": MistakeMoveIcon,
        "a miss": MissMoveIcon,
        "a missed win": MissedWinMoveIcon,
        "forced": ForcedMoveIcon,
        "critical": CriticalMoveIcon,
        "brilliant": BrilliantMoveIcon,
    };

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
                return winningForPlayer(mateAfter) ? "The Best Move" : "A Blunder";
            }

            // Lost a mate
            if (mateBefore !== null && mateAfter === null) {
                return winningForPlayer(mateBefore) ? "A Missed Win" : "A Blunder";
            }

            if (mateBefore !== null && mateAfter !== null) {
                const beforeWinning = winningForPlayer(mateBefore);
                const afterWinning = winningForPlayer(mateAfter);

                // Mate switched sides
                if (beforeWinning !== afterWinning) {
                    return afterWinning ? "The Best Move" : "A Blunder";
                }

                const beforeDist = Math.abs(mateBefore);
                const afterDist = Math.abs(mateAfter);

                if (afterWinning) {
                    if (afterDist <= beforeDist - 1) return "The Best Move";
                    if (afterDist > beforeDist) return "Excellent";
                } else {
                    if (afterDist >= beforeDist - 1) return "The Best Move";
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

        if (playedMove === bestMove) return "The Best Move";
        if (loss <= 0.035) return "Excellent";
        if (loss <= 0.07) return "Good";
        if (loss <= 0.1) return "An Inaccuracy";
        if (loss <= 0.2) return "A Mistake";
        if (loss <= 1) return "A Blunder";

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

                if (tempGame.moves().length === 1) {
                    qualities.push("Forced");
                    continue;
                }

                if (i <= 20 && isBookMove(moves.slice(0, i))) {
                    qualities.push("A Book Move");
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
                        qualities.push("A Miss");
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

            await new Promise((resolve) => setTimeout(resolve, 500));
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
            <div className="flex h-[500px] w-[540px] items-center gap-2 justify-self-center">
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
            <div className="m-5 w-[400px] rounded-xl items-center justify-self-end bg-background-100 p-4 overflow-hidden flex flex-col h-[95%]">
                <h2 className="mb-12 text-3xl text-text-950 font-bold self-center justify-self-center">
                    Move Analysis
                </h2>
                <div className="flex flex-col w-full items-center gap-3">
                    {/* Tools */}
                    <div className="flex gap-2 p-2 bg-secondary-400 rounded-lg w-full items-center justify-center">
                        <RefreshCcw size={30} className="cursor-pointer"/>
                        <Settings size={30} className="cursor-pointer"/>
                        <Share2 size={30} className="cursor-pointer"/>
                    </div>
                    <div className="flex flex-col rounded-lg w-full overflow-hidden">
                        {currentMove > 0 && moveQualities[currentMove - 1] !== undefined && moveQualities[currentMove - 1] !== null && (() => {
                            const qualityKey = moveQualities[currentMove - 1]?.toLowerCase() ?? "";

                            const IconComponent = moveToIcon[qualityKey] ?? BookIcon;

                            return (
                                <div className="flex gap-1 items-center justify-center bg-secondary-400 w-full p-2">
                                    
                                    <IconComponent />

                                    <span className={`text-xl ${moveToColor[qualityKey] ?? 'text-[#C5A888]'} font-medium [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]`}>
                                        {moves[currentMove - 1]} is {moveQualities[currentMove - 1]?.toLowerCase() ?? "No analysis"}
                                    </span>
                                </div>
                            );
                        })()}

                        {(() => {
                            const playedMove = moves[currentMove - 1];

                            const bestMoveUci = evaluations[currentMove - 1]?.bestMove;
                            let bestMoveSan = "";

                            if (currentMove > 0 && bestMoveUci) {
                                const tempGame = new Chess();
                                for (let i = 0; i < currentMove - 1; i++) {
                                    tempGame.move(moves[i]);
                                }
                                bestMoveSan = uciToSan(bestMoveUci, tempGame.fen());
                            }

                            if (currentMove <= 0 || bestMoveSan === playedMove || moveQualities[currentMove - 1]?.toLowerCase() === "a book move") {
                                return null;
                            }

                            return (
                                <div className="bg-secondary-400 w-full text-center p-2">
                                    <span className="font-medium text-center text-accent-600">
                                        The best move was: {bestMoveSan}
                                    </span>
                                </div>
                            );
                        })()}

                        {openingName !== "Starting Position" && (
                            <div className="flex items-center justify-center bg-secondary-300 w-full p-2">
                                <span className="text-xl font-medium text-center">
                                    {openingName}
                                </span>
                            </div>
                        )}


                    </div>
                </div>
            </div>

        </div>
    );
}