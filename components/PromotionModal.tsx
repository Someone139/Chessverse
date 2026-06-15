import { ChessQueen, ChessRook, ChessBishop, ChessKnight } from "lucide-react";

export default function PromotionModal({
  showPromotion,
  handlePromotion,
}: {
  showPromotion: boolean;
  handlePromotion: (piece: string) => void;
}) {
  if (!showPromotion) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[#412B6B] rounded-xl p-6 flex gap-4 shadow-2xl">
        <button
            onClick={() => handlePromotion("q")}
            className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
        >
            <ChessQueen size={40} strokeWidth={1.5} />
        </button>

        <button
            onClick={() => handlePromotion("r")}
            className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
        >
            <ChessRook size={40} strokeWidth={1.5} />
        </button>

        <button
            onClick={() => handlePromotion("b")}
            className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
        >
            <ChessBishop size={40} strokeWidth={1.5} />
        </button>

        <button
            onClick={() => handlePromotion("n")}
            className="bg-[#5C3E94] p-4 rounded-lg cursor-pointer"
        >
            <ChessKnight size={40} strokeWidth={1.5} />
        </button>
        </div>
    </div>
  );
}