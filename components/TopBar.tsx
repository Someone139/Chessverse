"use client";

import { ChessKing, Swords, Puzzle, BookOpen, ChartNoAxesCombined, Trophy, Settings, User } from "lucide-react";

type Props = {
  setPage: (page: string) => void;
};

export default function TopBar({ setPage }: Props) {
  return (
    <header className="flex justify-between items-center gap-2 min-w-screen px-4 h-[60px] border-b-2 border-zinc-950 bg-gradient-to-b from-[#412B6B]/80 to-purple-950/90">
        <div className="flex items-center ml-2">
            {/* Button to home page (LEFT)*/}
            <button
            onClick={() => setPage("Home")}
            className="flex gap-1.5 cursor-pointer py-3 px-1 rounded-lg"
            >
            <ChessKing size={30} className="-mt-0.5"/>
            <div className="font-bold text-2xl">
                Chessverse
            </div>
            </button>
        </div>
        {/* Other buttons (CENTER)*/}
        <div className="flex items-center gap-5">
            {/* Play button */}
            <button
            onClick={() => setPage("Game")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <Swords size={18} className="mt-[5px]"/>
            <p className="text-lg font-semibold">Play</p>
            </button>
            {/* Puzzles */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <Puzzle size={18} className="mt-[4px]"/>
            <p className="text-lg font-semibold">Puzzles</p>
            </button>
            {/* Learn */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <BookOpen size={18} className="mt-[5px]"/>
            <p className="text-lg font-semibold">Learn</p>
            </button>
            {/* Stats */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <ChartNoAxesCombined size={18} className="mt-[4px]"/>
            <p className="text-lg font-semibold">Statistics</p>
            </button>
            {/* Leaderboard */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <Trophy size={18} className="mt-[4px]"/>
            <p className="text-lg font-semibold">Leaderboard</p>
            </button>
            {/* Settings */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer gap-1 bg-[#211832]/90 rounded-lg px-6 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <Settings size={18} className="mt-[4px]"/>
            <p className="text-lg font-semibold">Settings</p>
            </button>
        </div>
        <div className="flex items-center ml-2">
            {/* Profile Button (RIGHT)*/}
            <button
            onClick={() => setPage("Home")}
            className="flex gap-1.5 bg-[#211832] cursor-pointer rounded-lg px-8 py-3 hover:bg-[#5C3E94] transition-colors"
            >
            <User size={30} className="-mt-0.5"/>
            <div className="font-semibold text-lg">
                Profile
            </div>
            </button>
        </div>
    </header>
  );
}