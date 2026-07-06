"use client";

import { Swords, Users, Bot } from "lucide-react";

type Props = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export default function SideButtons({
  setPage,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center px-4 gap-2.5">
            <button
            onClick={() => {
                setPage("Home")
                // Replace above for the choosing time popup referenced in TimeControlGrid
            }}
            className="group flex items-center bg-background-100 h-16 w-full justify-start px-6 text-text-900 rounded-lg cursor-pointer gap-3 hover:text-primary-500 hover:bg-background-200 transition-all duration-200"
            >
                <Swords size={37} strokeWidth={1.7} className="group-hover:motion-safe:animate-mini-bounce"/>
                <p className="text-text-900">Create a new game</p>
            </button>
            <button
            className="group flex items-center bg-background-100 h-16 w-full justify-start px-6 text-text-900 rounded-lg cursor-pointer gap-3 hover:text-primary-500 hover:bg-background-200 transition-all duration-200"
            >
                <Users size={37} strokeWidth={1.7} className="group-hover:motion-safe:animate-mini-bounce"/>
                <p className="text-text-900">Play a friend</p>
            </button>
            <button
            onClick={() => {
                setPage("Game")
                // Replace above for the choosing time popup referenced in TimeControlGrid
            }}
            className="group flex items-center bg-background-100 h-16 w-full justify-start px-6 text-text-900 rounded-lg cursor-pointer gap-3 hover:text-primary-500 hover:bg-background-200 transition-all duration-200"
            >
                <Bot size={37} strokeWidth={1.7} className="mb-1.5 group-hover:motion-safe:animate-mini-bounce"/>
                <p className="text-text-900">Play vs computer</p>
            </button>
        </div>
    );
}