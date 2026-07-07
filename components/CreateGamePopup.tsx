"use client";

import { Settings, Clock, CirclePlus, Plus } from "lucide-react";
import type { TimeControl } from "@/app/page";
import { useState } from "react";

type Props = {
  setSelectedTimeControl: React.Dispatch<React.SetStateAction<TimeControl | null>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setShowTimeControlModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateGamePopup({
    setSelectedTimeControl,
    setPage,
    setShowTimeControlModal,
}: Props) {
    const [timeInSeconds, setTimeInSeconds] = useState(600);
    const [incrementInSeconds, setIncrementInSeconds] = useState(0);

    function formatTime(totalSeconds: number): string {
        if (totalSeconds < 60) {
            if (totalSeconds === 15) return "1/4";
            if (totalSeconds === 30) return "1/2";
            if (totalSeconds === 45) return "3/4";
        }

        const minutes = Math.floor(totalSeconds / 60);
        return String(minutes);
    }

    function sliderStepToSeconds(step: number): number {
        if (step <= 8) {
            return step * 15;
        }
        return 120 + (step - 8) * 60;
    }

    function secondsToSliderStep(seconds: number): number {
        if (seconds <= 120) {
            return Math.round(seconds / 15);
        }
        return 8 + Math.round((seconds - 120) / 60);
    }
    
    return (
        <>
            {/* Dark background */}
            <button
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => {
                setShowTimeControlModal(false)
            }}
            >
            </button>

            <div className="fixed flex flex-col self-center left-1/2 -translate-x-1/2 items-center z-50 rounded-xl bg-background-100 w-150 h-140 shadow-2xl border border-border">
                {/* Title */}
                <div className='flex gap-1 items-center bg-secondary-100 justify-center rounded-t-xl border-b border-border p-4 w-full'>
                    <Settings size={40}/>
                    <p className="text-3xl font-bold text-center">Game Configuration</p>
                </div>
                {/* Variants */}
                {/* Time */}
                <div className="flex flex-col w-full gap-1 py-3">
                    <span className="text-text-950 font-bold text-xl text-center">Time Control</span>
                    <div className="flex w-full px-2 py-1">
                        <div className="flex flex-col gap-3 w-[49%]">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                                    <Clock size={18} />
                                    <p>Minutes</p>
                                </div>
                                <div className="flex items-center text-2xl font-black text-text-950 rounded-lg bg-secondary-400 px-1 w-24">
                                    <input
                                        type="text"
                                        value={formatTime(timeInSeconds)}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;

                                            if (!inputValue) {
                                                setTimeInSeconds(0);
                                                return;
                                            }

                                            let mins = 0;
                                            if (inputValue === "1/4") mins = 0.25;
                                            else if (inputValue === "1/2") mins = 0.5;
                                            else if (inputValue === "3/4") mins = 0.75;
                                            else {
                                                const cleanValue = inputValue.replace(/[^0-9.]/g, '');
                                                mins = Number(cleanValue);
                                            }

                                            const validatedMins = Math.min(180, Math.max(0, mins));

                                            setTimeInSeconds(validatedMins * 60);
                                        }}
                                        className="w-full bg-transparent text-center focus:outline-none"
                                    />
                                </div>
                            </div>

                            <input 
                                type="range"
                                min="0"
                                max="186"
                                step="1"
                                value={secondsToSliderStep(timeInSeconds)}
                                onChange={(e) => setTimeInSeconds(sliderStepToSeconds(Number(e.target.value)))}
                                className={timeInSeconds === 0 && incrementInSeconds === 0 ? "w-full h-2 bg-secondary-400 rounded-lg appearance-none shadow-[0_0_12px_rgba(255,0,0,0.6)] cursor-pointer accent-primary focus:outline-none" : "w-full h-2 bg-secondary-400 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"}
                            />
                        </div>
                        <div className="p-1">
                            <Plus size={25} className="text-2xl font-black text-text-950"/>
                        </div>
                        <div className="flex flex-col gap-3 w-[49%]">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center text-2xl font-black text-text-950 rounded-lg bg-secondary-400 px-1 w-24">
                                    <input
                                        type="text"
                                        value={incrementInSeconds}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;

                                            if (!inputValue) {
                                                setIncrementInSeconds(0);
                                                return;
                                            }

                                            const cleanValue = inputValue.replace(/[^0-9]/g, '');
                                            const seconds = Number(cleanValue);

                                            const validatedSeconds = Math.min(Math.max(0, seconds));

                                            setIncrementInSeconds(validatedSeconds);
                                        }}
                                        className="w-full bg-transparent text-center focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                                    <CirclePlus size={18} />
                                    <span>Increment</span>
                                </div>
                            </div>

                            <input 
                                type="range" 
                                min="0" 
                                max="180"
                                step="1"
                                value={incrementInSeconds}
                                onChange={(e) => setIncrementInSeconds(Number(e.target.value))}
                                className={timeInSeconds === 0 && incrementInSeconds === 0 ? "w-full h-2 bg-secondary-400 rounded-lg appearance-none shadow-[0_0_12px_rgba(255,0,0,0.6)] cursor-pointer accent-primary focus:outline-none" : "w-full h-2 bg-secondary-400 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"}
                            />
                        </div>
                    </div>
                </div>
                {/* The Rest */}
                {/* Create Game Button */}
                <div className='flex gap-1 items-center bg-secondary-100 justify-center rounded-b-xl border-t border-border p-4 w-full mt-auto'>
                    <CirclePlus size={40}/>
                    <button
                        onClick={() => {
                            // Cria um objeto TimeControl novo com todas as propriedades calculadas
                            const newCustomControl: TimeControl = {
                                id: `${formatTime(timeInSeconds)} + ${incrementInSeconds}`,
                                name: `${formatTime(timeInSeconds)}+${incrementInSeconds}`,
                                base: timeInSeconds,
                                increment: incrementInSeconds,
                                type: "Custom"
                            };

                            setSelectedTimeControl(newCustomControl);
                            setShowTimeControlModal(false);
                            setPage("Game");
                        }}
                        className="text-3xl font-bold text-center cursor-pointer focus:outline-none"
                    >
                        Create game
                    </button>
                </div>
            </div>
        </>
    )
}