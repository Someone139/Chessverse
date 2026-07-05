"use client";

import { ChessKing, HandCoins, User, Settings } from "lucide-react";

type Props = {
  setPage: (page: string) => void;
};

export default function TopBar({ setPage }: Props) {
  return (
    <header className="grid grid-cols-2 items-center min-w-screen px-4 h-full border-b border-border bg-background-100">
        <div className="flex items-center justify-self-start ml-2">
            {/* Button to home page (LEFT)*/}
            <button
            onClick={() => window.location.reload()}
            className="group flex gap-1.5 cursor-pointer items-center py-3 px-1 rounded-lg text-text-950 hover:text-primary-500 transition-all duration-200"
            >
            <ChessKing size={30} className="-mt-1.5 group-hover:rotate-90 transition-transform duration-500"/>
            <div className="font-bold text-2xl">
                Chessverse
            </div>
            </button>
            {/* Other buttons (CENTER)*/}
            <div className="flex items-center ml-5">
                {/* Play button */}
                <button
                onClick={() => setPage("Game")}
                className="flex cursor-pointer items-center rounded-lg px-3 py-3 hover:bg-background-200 transition-all duration-200"
                >
                <p className="text-base text-text-900 font-semibold">Play</p>
                </button>
                {/* Puzzles */}
                <button
                onClick={() => setPage("Home")}
                className="flex cursor-pointer items-center rounded-lg px-3 py-3 hover:bg-background-200 transition-all duration-200"
                >
                <p className="text-base text-text-900 font-semibold">Puzzles</p>
                </button>
                {/* Learn */}
                <button
                onClick={() => setPage("Home")}
                className="flex cursor-pointer items-center rounded-lg px-3 py-3 hover:bg-background-200 transition-all duration-200"
                >
                <p className="text-base text-text-900 font-semibold">Learn</p>
                </button>
                {/* Stats */}
                <button
                onClick={() => setPage("Home")}
                className="flex cursor-pointer items-center rounded-lg px-3 py-3 hover:bg-background-200 transition-all duration-200"
                >
                <p className="text-base text-text-900 font-semibold">Statistics</p>
                </button>
                {/* Leaderboard */}
                <button
                onClick={() => setPage("Home")}
                className="flex cursor-pointer items-center rounded-lg px-3 py-3 hover:bg-background-200 transition-all duration-200"
                >
                <p className="text-base text-text-900 font-semibold">Leaderboard</p>
                </button>
                {/* Donate */}
                <button
                onClick={() => setPage("Home")}
                className="flex cursor-pointer items-center rounded-lg gap-1 px-3 py-3 hover:bg-accent-200/50 transition-all duration-200 text-accent-500"
                >
                <HandCoins size={20} />
                <p className="text-base font-semibold">Donate</p>
                </button>
            </div>
        </div>
        <div className="flex items-center justify-self-end ml-2">
            {/* Profile Button (RIGHT)*/}
            <button
            onClick={() => setPage("Home")}
            className="flex cursor-pointer items-center border border-border gap-1 bg-background-50 rounded-lg px-8 py-3 hover:bg-background-300 transition-all duration-200"
            >
            <User size={25} className="-mt-0.5 text-text-950"/>
            <p className="font-semibold text-base text-text-950">
                Profile
            </p>
            </button>
        </div>
    </header>
  );
}