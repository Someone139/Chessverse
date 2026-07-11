"use client";

import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import ReviewBoard from "@/components/ReviewBoard";
import ReviewMoveHistory from "@/components/ReviewMoveHistory";
import EvaluationBar from "@/components/EvaluationBar";
import { getEvaluation } from "@/lib/stockfish";

type Props = {
  moves: string[];
  getPieceSymbol: (p: string) => React.ReactNode;
};

export default function GameReview({
  moves,
  getPieceSymbol,
}: Props) {
    const [currentMove, setCurrentMove] = useState(moves.length);

    const [winner, setWinner] = useState<number>(0);

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

    const [evaluation, setEvaluation] = useState<number>(0);
    const [mate, setMate] = useState<number | null>(null);

    useEffect(() => {
        async function analyse() {
            if (game.isCheckmate()) {
                const result = game.turn() === "w" ? -1 : 1;

                setWinner(result);
                setMate(null);

                return;
            }

            setWinner(0);

            const result = await getEvaluation(game.fen());
            const turn = game.fen().split(" ")[1];

            let latestScore = result.score;
            let latestMate = result.mate
                if (turn === "b") {
                    latestScore *= -1;
                    if (latestMate !== null && latestMate !== undefined) {
                        latestMate *= -1;
                    }
                }

            setEvaluation(latestScore);
            setMate(latestMate);
        }
        analyse();
    }, [currentMove]);

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

    useEffect(() => {
        rebuildCaptured(game);
    }, [currentMove]);

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
        <ReviewBoard
            game={game}
            boardOrientation="white"
            lastMove={lastMove}
            captured={captured}
            getPieceSymbol={getPieceSymbol}
        />

        {/* Evaluation */}
        <div>
            <EvaluationBar
                evaluation={evaluation}
                mate={mate}
                winner={winner}
            />
        </div>

        </div>
    );
}