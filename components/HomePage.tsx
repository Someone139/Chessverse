"use client";

import { ChessKing, Swords, Users, Bot, Puzzle, Key } from "lucide-react";
import { useState } from "react";
import TimeControlGrid, { TimeControl } from "@/components/TimeControlGrid";

type Props = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  selectedTimeControl: TimeControl | null;
  setSelectedTimeControl: React.Dispatch<
    React.SetStateAction<TimeControl | null>
  >;
};

export default function HomePage({
  setPage,
  selectedTimeControl,
  setSelectedTimeControl,
}: Props) {
  return (
    <div className="grid grid-cols-[27%_1fr_27%] text-center items-center bg-background-50 overflow-auto">
      
        <div>

        </div>

        <TimeControlGrid
            selectedTimeControl={selectedTimeControl}
            setSelectedTimeControl={setSelectedTimeControl}
            setPage={setPage}
        />

        {/* Other Buttons */}
        <div className="flex flex-col items-center justify-center px-4 gap-2.5">
            <button
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
                setPage("Home")
                // Replace above for the choosing time popup referenced in TimeControlGrid
            }}
            className="group flex items-center bg-background-100 h-16 w-full justify-start px-6 text-text-900 rounded-lg cursor-pointer gap-3 hover:text-primary-500 hover:bg-background-200 transition-all duration-200"
            >
                <Bot size={37} strokeWidth={1.7} className="mb-1.5 group-hover:motion-safe:animate-mini-bounce"/>
                <p className="text-text-900">Play vs computer</p>
            </button>
        </div>

    </div>
  );
}

// export default function HomePage({ setPage }: Props) {
//     return (
//         <div className="grid grid-rows-2 text-center items-center bg-background-50">
//             <div className="grid grid-rows-2 text-center items-center space-y-5">
//                 <div className="flex flex-col text-center items-center justify-center">
//                 <ChessKing size={60} className="mb-2 text-text-950 hover:rotate-90 transition-all duration-500"/>
//                 <h1 className="font-bold text-6xl text-text-950">Chessverse</h1>
//                 <p className="text-text-950/80 -mt-1">Your move.</p>
//                 </div>
//                 <div className="grid grid-cols-4 text-center items-center justify-center space-x-10 px-10">
//                 {/* Quick Play */}
//                 <button
//                 onClick={() => setPage("Game")}
//                 className="flex flex-col text-center items-center justify-center cursor-pointer shadow-lg shadow-black/50 bg-primary-400 py-10 rounded-xl hover:bg-primary-500 hover:scale-105 hover:shadow-primary-500/30 transition-all duration-200"
//                 >
//                     <Swords size={45} className="mb-3 text-text-950"/>
//                     <h2 className="font-semibold text-2xl text-text-950">Quick Play</h2>
//                     <p className="text-xs text-text-950/80 mt-1.5">Jump into a game</p>
//                 </button>
//                 {/* Play with Friends */}
//                 <button
//                 onClick={() => setPage("Home")}
//                 className="flex flex-col text-center items-center justify-center cursor-pointer shadow-lg shadow-black/50 bg-secondary-200 py-10 rounded-xl hover:bg-secondary-300 hover:scale-105 transition-all duration-200"
//                 >
//                     <Users size={45} className="mb-3 text-text-950"/>
//                     <h2 className="font-semibold text-2xl text-text-950">Play with Friends</h2>
//                     <p className="text-xs text-text-950/80 mt-1.5">Challenge a friend</p>
//                 </button>
//                 {/* Play with AI */}
//                 <button
//                 onClick={() => setPage("Home")}
//                 className="flex flex-col text-center items-center justify-center cursor-pointer shadow-lg shadow-black/50 bg-secondary-200 py-10 rounded-xl hover:bg-secondary-300 hover:scale-105 transition-all duration-200"
//                 >
//                     <Bot size={45} className="mb-3 text-text-950"/>
//                     <h2 className="font-semibold text-2xl text-text-950">Play vs AI</h2>
//                     <p className="text-xs text-text-950/80 mt-1.5">Train against AI</p>
//                 </button>
//                 {/* Puzzles */}
//                 <button
//                 onClick={() => setPage("Home")}
//                 className="flex flex-col text-center items-center justify-center cursor-pointer shadow-lg shadow-black/50 bg-secondary-200 py-10 rounded-xl hover:bg-secondary-300 hover:scale-105 transition-all duration-200"
//                 >
//                     <Puzzle size={45} className="mb-3 text-text-950"/>
//                     <h2 className="font-semibold text-2xl text-text-950">Puzzles</h2>
//                     <p className="text-xs text-text-950/80 mt-1.5">Solve and Improve</p>
//                 </button>
//                 </div>
//             </div>
//             <div className="flex flex-col text-center items-center">
//                 <h1 className="text-3xl text-text-950">This website is under development. Please save the URL and check again later. One day, you might be playing chess here.</h1>
//             </div>
//         </div>
//     );
// }