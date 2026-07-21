import { Chess } from "chess.js";
import { openings } from "./openings";


export function getOpeningFromMoves(moves:string[]) {

    const game = new Chess();

    const uciMoves:string[] = [];

    for (const move of moves) {
        const played = game.move(move);

        uciMoves.push(
            played.from +
            played.to +
            (played.promotion ?? "")
        );
    }


    let bestMatch = null;


    for (const opening of openings) {

        const openingMoves = opening.uci.split(" ");

        if (
            uciMoves
            .slice(0, openingMoves.length)
            .join(" ")
            === opening.uci
        ) {

            if (
                !bestMatch ||
                openingMoves.length >
                bestMatch.uci.split(" ").length
            ) {
                bestMatch = opening;
            }
        }
    }


    return bestMatch;
}