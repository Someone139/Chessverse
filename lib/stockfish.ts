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
        sf.removeEventListener(
          "message",
          handler
        );
        resolve(line.split(" ")[1]);
      }
    };

    sf.addEventListener(
      "message",
      handler
    );

    sf.postMessage("uci");
  });
}



export function getEvaluation(fen: string): Promise<{
  score: number;
  mate: number | null;
}> {
  const sf = initStockfish();

  return new Promise((resolve) => {
    let score = 0;
    let mate: number | null = null;

    const handler = (event: MessageEvent) => {
      const line = event.data;

      if (typeof line !== "string") return;

      if (
        line.startsWith("info") &&
        line.includes("score")
      ) {
        const parts = line.split(" ");
        const scoreIndex = parts.indexOf("score");

        if (scoreIndex !== -1) {
          const type = parts[scoreIndex + 1];
          const value = Number(parts[scoreIndex + 2]);

          if (type === "cp") {
            score = value / 100;
            mate = null;
          }

          if (type === "mate") {
            mate = value;
          }
        }
      }

      if (line.startsWith("bestmove")) {

        sf.removeEventListener(
          "message",
          handler
        );


        resolve({
          score,
          mate
        });

      }
    };

    sf.addEventListener(
      "message",
      handler
    );


    sf.postMessage(
      `position fen ${fen}`
    );

    sf.postMessage(
      "go depth 12"
    );

  });
}