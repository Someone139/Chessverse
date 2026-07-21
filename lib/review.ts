import { Chess } from "chess.js";
import { getEvaluation } from "./stockfish";

export type PositionEvaluation = {
    score: number;
    mate: number | null;
};

export type MoveReview = {
    loss: number;
    label:
        | "best"
        | "excellent"
        | "good"
        | "inaccuracy"
        | "mistake"
        | "blunder";
};

export async function analyseGame(moves: string[]) {
    const game = new Chess();

    const fens: string[] = [];

    fens.push(game.fen());

    for (const move of moves) {
        game.move(move);
        fens.push(game.fen());
    }

    const evaluations = await evaluatePositions(fens);

    console.log(evaluations);

    return evaluations;
}

async function evaluatePositions(fens: string[]) {
    const evaluations: PositionEvaluation[] = [];

    for (const fen of fens) {
        const evaluation = await getEvaluation(fen);
        evaluations.push(evaluation);
    }

    return evaluations;
}