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
                3,
                Math.min(
                    97,
                    50 + (50 * (2 / (1 + Math.exp(-evaluation / 2)) - 1))
                )
            )
        : (winner === 1 ? 100 : 0);
    return (
        <div className="relative h-[500px] w-[32px] rounded-sm overflow-hidden border border-border bg-black">
            <div
                className="absolute bottom-0 w-full bg-white transition-all duration-300"
                style={{
                height: `${percentage}%`,
                }}
            />

            <div
                className={`absolute left-1/2 -translate-x-1/2 w-full text-center text-sm z-10 ${
                percentage < 50 ? "top-2 text-text-950" : "bottom-2 text-text-50"
                }`}
            >
                {winner !== 0
                    ? `${winner === 1 ? "1-0" : "0-1"}`
                    : mate !== null && mate !== 0
                        ? `M${Math.abs(mate)}`
                        : Math.abs(evaluation) < 10
                            ? `${evaluation > 0 ? "+" : ""}${evaluation.toFixed(1)}`
                            : `${evaluation > 0 ? "+" : ""}${evaluation.toFixed(0)}`
                }
            </div>
        </div>
    );
}