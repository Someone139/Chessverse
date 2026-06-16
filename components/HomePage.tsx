"use client";

import { ChessKing, Swords, Users, Bot, Puzzle } from "lucide-react";

type Props = {
  setPage: (page: string) => void;
};

export default function HomePage({ setPage }: Props) {
    return (
        <div className="grid grid-rows-2 text-center items-center bg-gradient-to-b from-bg1 to-bg2">
            <div className="grid grid-rows-2 text-center items-center space-y-5">
                <div className="flex flex-col text-center items-center justify-center">
                <ChessKing size={60} className="mb-2"/>
                <h1 className="font-bold text-6xl text-text">Chessverse</h1>
                <p className="text-textMuted -mt-1">Your move.</p>
                </div>
                <div className="grid grid-cols-4 text-center items-center justify-center space-x-10 px-10">
                {/* Quick Play */}
                <button
                onClick={() => setPage("Game")}
                className="flex flex-col text-center border border-buttonBorder items-center justify-center cursor-pointer bg-accent py-10 rounded-xl hover:bg-accentHover hover:scale-105 shadow-lg shadow-black/50 active:bg-accentActive transition-all duration-200"
                >
                    <Swords size={45} className="mb-3 text-iconAccent"/>
                    <h2 className="font-semibold text-2xl">Quick Play</h2>
                    <p className="text-xs text-textMuted mt-1.5">Jump into a game</p>
                </button>
                {/* Play with Friends */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center border border-buttonBorder items-center justify-center cursor-pointer bg-surface py-10 rounded-xl hover:bg-surfaceHover hover:scale-105 shadow-lg shadow-black/50 active:bg-surfaceActive transition-all duration-200"
                >
                    <Users size={45} className="mb-3 text-icon"/>
                    <h2 className="font-semibold text-2xl text-text">Play with Friends</h2>
                    <p className="text-xs text-textMuted mt-1.5">Challenge a friend</p>
                </button>
                {/* Play with AI */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center border border-buttonBorder items-center justify-center cursor-pointer bg-surface py-10 rounded-xl hover:bg-surfaceHover hover:scale-105 shadow-lg shadow-black/50 active:bg-surfaceActive transition-all duration-200"
                >
                    <Bot size={45} className="mb-3 text-icon"/>
                    <h2 className="font-semibold text-2xl text-text">Play vs AI</h2>
                    <p className="text-xs text-textMuted mt-1.5">Train against AI</p>
                </button>
                {/* Puzzles */}
                <button
                onClick={() => setPage("Home")}
                className="flex flex-col text-center border border-buttonBorder items-center justify-center cursor-pointer bg-surface py-10 rounded-xl hover:bg-surfaceHover hover:scale-105 shadow-lg shadow-black/50 active:bg-surfaceActive transition-all duration-200"
                >
                    <Puzzle size={45} className="mb-3 text-icon"/>
                    <h2 className="font-semibold text-2xl text-text">Puzzles</h2>
                    <p className="text-xs text-textMuted mt-1.5">Solve and Improve</p>
                </button>
                </div>
            </div>
            <div className="flex flex-col text-center items-center">
                <h1 className="text-3xl text-text">This website is under development. Please save the URL and check again later. One day, you might be playing chess here.</h1>
            </div>
        </div>
    );
}