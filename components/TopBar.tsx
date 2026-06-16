"use client";

import { ChessKing, Swords, Puzzle, BookOpen, ChartNoAxesCombined, Trophy, Settings, User } from "lucide-react";

type Props = {
  setPage: (page: string) => void;
};

export default function TopBar({ setPage }: Props) {
  return (
    <header className="flex justify-between items-center gap-2 min-w-screen px-4 h-full border-b-2 border-border bg-surface">
        <div className="flex items-center ml-2">
            {/* Button to home page (LEFT)*/}
            <button
            onClick={() => setPage("Home")}
            className="flex gap-1.5 cursor-pointer py-3 px-1 rounded-lg"
            >
            <ChessKing size={30} className="-mt-0.5"/>
            <div className="font-bold text-text text-2xl">
                Chessverse
            </div>
            </button>
        </div>
        {/* Other buttons (CENTER)*/}
        <div className="flex items-center gap-5">
            {/* Play button */}
            <button
            onClick={() => setPage("Game")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <Swords size={18} className="mt-[5px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Play</p>
            </button>
            {/* Puzzles */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <Puzzle size={18} className="mt-[4px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Puzzles</p>
            </button>
            {/* Learn */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <BookOpen size={18} className="mt-[5px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Learn</p>
            </button>
            {/* Stats */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <ChartNoAxesCombined size={18} className="mt-[4px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Statistics</p>
            </button>
            {/* Leaderboard */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <Trophy size={18} className="mt-[4px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Leaderboard</p>
            </button>
            {/* Settings */}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1 bg-surfaceDark rounded-lg px-6 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <Settings size={18} className="mt-[4px] text-textMuted"/>
            <p className="text-lg text-textMuted font-semibold">Settings</p>
            </button>
        </div>
        <div className="flex items-center ml-2">
            {/* Profile Button (RIGHT)*/}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer border border-border gap-1.5 bg-surfaceDark rounded-lg px-8 py-3 hover:bg-surfaceDarkHover active:bg-surfaceDark transition-all duration-200"
            >
            <User size={30} className="-mt-0.5"/>
            <div className="font-semibold text-lg text-text">
                Profile
            </div>
            </button>
        </div>
    </header>
  );
}