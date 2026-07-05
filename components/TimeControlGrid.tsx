"use client";

import { useState } from 'react';

export type TimeControl = {
  id: string;
  name: string;
  base: number;
  increment: number;
  type: string;
};

type Props = {
  selectedTimeControl: TimeControl | null;
  setSelectedTimeControl: React.Dispatch<React.SetStateAction<TimeControl | null>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export default function TimeControlGrid({
  selectedTimeControl,
  setSelectedTimeControl,
  setPage,
}: Props) {
    const timeControls: TimeControl[] = [
        { id: "1 + 0", name: "1+0", base: 60, increment: 0, type: "Bullet" },
        { id: "2 + 1", name: "2+1", base: 120, increment: 1, type: "Bullet" },
        { id: "3 + 0", name: "3+0", base: 180, increment: 0, type: "Bullet" },

        { id: "3 + 2", name: "3+2", base: 180, increment: 2, type: "Blitz" },
        { id: "5 + 0", name: "5+0", base: 300, increment: 0, type: "Blitz" },
        { id: "5 + 3", name: "5+3", base: 300, increment: 3, type: "Blitz" },

        { id: "10 + 0", name: "10+0", base: 600, increment: 0, type: "Rapid" },
        { id: "10 + 5", name: "10+5", base: 600, increment: 5, type: "Rapid" },
        { id: "15 + 10", name: "15+10", base: 900, increment: 10, type: "Rapid" },

        { id: "30 + 0", name: "30+0", base: 1800, increment: 0, type: "Classical" },
        { id: "30 + 20", name: "30+20", base: 1800, increment: 20, type: "Classical" },
        { id: "Custom", name: "Custom", base: 900, increment: 5, type: "You choose" },
    ];

    return (
        <div className="grid grid-cols-3 grid-rows-4 h-[75%] w-full gap-1.5">
        {timeControls.map((control) => (
            <button
                key={control.id}
                onClick={() => {
                    if (control.id !== "Custom") {
                        setSelectedTimeControl(control);
                        setPage("Game");
                    }
                    else {
                        setSelectedTimeControl(control);
                        setPage("Home")
                        // Replace above, choosing the time popup here (centered)
                    }
                }}
                className={`flex flex-col items-center justify-center text-center rounded-xl border border-border cursor-pointer transition-all duration-200
                ${
                    selectedTimeControl?.id === "Custom" && selectedTimeControl?.id === control.id
                    ? "bg-primary-500 border-primary-500"
                    : "border-border hover:bg-primary-500/40"
                }`}
                >
                <p className="text-text-950 tracking-wide text-4xl font-thin">
                    {control.name}
                </p>
                <p className="text-text-950/80 text-lg">
                    {control.type}
                </p>
                </button>
        ))}
        </div>
    );
}