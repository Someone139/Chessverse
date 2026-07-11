"use client";

type Props = {
    evaluation: number;
    mate: number | null;
    winner: number;
};

export default function EvaluationBar({
    evaluation,
    mate,
    winner,
}: Props) {

    const percentage = winner === 0
        ? mate !== null
            ? (mate > 0 ? 100 : 0)
            : Math.max(
                2,
                Math.min(
                    98,
                    50 + (50 * (2 / (1 + Math.exp(-evaluation)) - 1))
                )
            )
        : (winner === 1 ? 100 : 0);
    return (
        <div className="flex flex-col items-center gap-3">
        <p className="text-3xl font-semibold text-text-950">
            {winner !== 0
                ? `${winner === 1 ? "1-0" : "0-1"}`
                : mate !== null && mate !== 0
                    ? `M${Math.abs(mate)}`
                    : `${evaluation > 0 ? "+" : ""}${evaluation.toFixed(1)}`
            }
        </p>

        <div className="relative h-[540px] w-7 rounded-sm  overflow-hidden border border-border bg-black">
            <div
            className="absolute bottom-0 w-full bg-white transition-all duration-300"
            style={{
                height: `${percentage}%`,
            }}
            />
        </div>
        </div>
    );
}