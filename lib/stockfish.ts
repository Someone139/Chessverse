let engine: Worker | null = null;

function initStockfish() {
  if (engine) return engine;

  engine = new Worker("/stockfish.js");

  return engine;
}

export function getBestMove(fen: string): Promise<string> {
  const sf = initStockfish();

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      const line = event.data;

      if (typeof line !== "string") return;

      if (line === "uciok") {
        sf.postMessage("isready");
      }

      if (line === "readyok") {
        sf.postMessage(`position fen ${fen}`);
        sf.postMessage("go depth 12");
      }

      if (line.startsWith("bestmove")) {
        sf.removeEventListener("message", handler);
        resolve(line.split(" ")[1]);
      }
    };

    sf.addEventListener("message", handler);

    sf.postMessage("uci");
  });
}