"use client";

import { ChessKing, Swords, Users, Bot, Puzzle, Key } from "lucide-react";
import { useState } from "react";
import TimeControlGrid, { TimeControl } from "@/components/TimeControlGrid";
import SideButtons from "@/components/SideButtons";

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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 z-0">
            <ChessKing size={600} className="mt-[65px]"/>
        </div>
      
        <div>

        </div>

        <TimeControlGrid
            selectedTimeControl={selectedTimeControl}
            setSelectedTimeControl={setSelectedTimeControl}
            setPage={setPage}
        />

        {/* Other Buttons */}
        <SideButtons
            setPage={setPage}
        />
    </div>
  );
}