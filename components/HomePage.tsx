"use client";

import { ChessKing, Swords, Users, Bot } from "lucide-react";

type Props = {
  setPage: (page: string) => void;
};

export default function HomePage({ setPage }: Props) {
  return (
    <div className="grid grid-rows-2 text-center items-center bg-gradient-to-b from-[#211832]/80 to-zinc-900/90">
        <div className="grid grid-rows-2 text-center items-center space-y-5">
            <div className="flex flex-col text-center items-center justify-center">
            <ChessKing size={60} className="mb-2"/>
            <h1 className="font-bold text-6xl">Chessverse</h1>
            <p className="text-zinc-200 -mt-1">Your move.</p>
            </div>
            <div className="grid grid-cols-4 text-center items-center justify-center space-x-10 px-10">
            {/* Quick Play */}
            <button
            onClick={() => setPage("Game")}
            className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#F25912] py-10 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
            >
                <Swords size={45} color='#211832' className="mb-3"/>
                <h2 className="font-semibold text-2xl">Quick Play</h2>
                <p className="text-xs text-zinc-200 mt-1.5">Jump into a game</p>
            </button>
            {/* Play with Friends */}
            <button
            onClick={() => setPage("Home")}
            className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
            >
                <Users size={45} color='#211832' className="mb-3"/>
                <h2 className="font-semibold text-2xl">Play with Friends</h2>
                <p className="text-xs text-zinc-200 mt-1.5">Challenge a friend</p>
            </button>
            {/* Play with AI */}
            <button
            onClick={() => setPage("Home")}
            className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
            >
                <Bot size={45} color='#211832' className="mb-3"/>
                <h2 className="font-semibold text-2xl">Play vs AI</h2>
                <p className="text-xs text-zinc-200 mt-1.5">Train against AI</p>
            </button>
            {/* Puzzles */}
            <button
            onClick={() => setPage("Home")}
            className="flex flex-col text-center items-center justify-center cursor-pointer bg-[#5C3E94] py-10 rounded-xl hover:bg-[#412B6B] transition-colors hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/50"
            >
                <Swords size={45} color='#211832' className="mb-3"/>
                <h2 className="font-semibold text-2xl">Puzzles</h2>
                <p className="text-xs text-zinc-200 mt-1.5">Solve and Improve</p>
            </button>
            </div>
        </div>
        <div className="flex flex-col text-center items-center">
            <h1 className="text-7xl">This website is under development. Please save the URL and check again later. One day, you might be playing chess here.</h1>
        </div>
    </div>
  );
}