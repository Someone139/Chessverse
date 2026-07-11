import type { TimeControl } from "@/app/page";

type Props = {
    turn: "w" | "b";
    selectedTimeControl: TimeControl | null;
};

export default function GameInfo({
    turn,
    selectedTimeControl,
}:Props) {
  return (
    <div className="w-[400px] flex-1 gap-3 h-full justify-self-end rounded-xl overflow-auto bg-background-100 border border-border p-3 flex flex-col">
        <h2 className="text-3xl font-bold text-center text-text-950">
            Game Info
        </h2>

        <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-background-200 border border-border p-3">
                <p className="text-sm text-text-600 uppercase tracking-wide">
                    Variant
                </p>
                <p className="mt-1 text-lg font-semibold text-text-950">
                    Standard
                </p>
            </div>

            <div className="rounded-lg bg-background-200 border border-border p-3">
                <p className="text-sm text-text-600 uppercase tracking-wide">
                    Time Control
                </p>
                <p className="mt-1 text-lg font-semibold text-text-950">
                    {selectedTimeControl ? selectedTimeControl.id : "10 + 0"}
                </p>
            </div>

            <div className="rounded-lg bg-background-200 border border-border p-3">
                <p className="text-sm text-text-600 uppercase tracking-wide">
                    Status
                </p>
                {turn === "w" && (
                    <p className="mt-1 text-lg font-semibold text-text-950">
                        White to Move
                    </p>
                )}
                {turn === "b" && (
                    <p className="mt-1 text-lg font-semibold text-text-950">
                        Black to Move
                    </p>
                )}
            </div>
        </div>
    </div>
  );
}