let engine: Worker | null = null;
let analysisEngine: Worker | null = null;


function initStockfish() {
  if (engine) return engine;

  engine = new Worker("/stockfish.js");

  return engine;
}


function initAnalysisEngine() {
  if (analysisEngine) return analysisEngine;

  analysisEngine = new Worker("/stockfish.js");

  return analysisEngine;
}

export function getBestMove(fen: string): Promise<string> {
  const sf = initStockfish();

  return new Promise((resolve) => {
    const handler = (event: MessageEvent) => {
      const line = event.data;

      if (typeof line !== "string") return;

      if (line === "uciok") {
        sf.postMessage("isready");
        return;
      }

      if (line === "readyok") {
        sf.postMessage(`position fen ${fen}`);
        sf.postMessage("go depth 12");
        return;
      }

      if (line.startsWith("bestmove")) {

        sf.removeEventListener(
          "message",
          handler
        );

        resolve(
          line.split(" ")[1]
        );
      }
    };

    sf.addEventListener(
      "message",
      handler
    );

    sf.postMessage("uci");
  });
}

export function getEvaluation(
  fen: string
): Promise<{
  score: number;
  mate: number | null;
  bestMove: string;
}> {

  const sf = initAnalysisEngine();
  let bestMove = "";

  return new Promise((resolve) => {
    let score = 0;
    let mate: number | null = null;
    let bestDepth = -1;

    const handler = (event: MessageEvent) => {
      const line = event.data;

      if (typeof line !== "string") return;

      if (line === "uciok") {
        sf.postMessage("isready");
        return;
      }

      if (line === "readyok") {
        sf.postMessage(
          `position fen ${fen}`
        );

        sf.postMessage(
          "go depth 12"
        );

        return;
      }

      if (line.startsWith("info") && line.includes("score")) {
        const parts = line.split(" ");

        const depthIndex = parts.indexOf("depth");

        const scoreIndex = parts.indexOf("score");

        if (depthIndex === -1 || scoreIndex === -1) return;

        const depth = Number(parts[depthIndex + 1]);

        if (depth < bestDepth) return;

        bestDepth = depth;

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

      if (line.startsWith("bestmove")) {
        bestMove = line.split(" ")[1];

        sf.removeEventListener(
          "message",
          handler
        );

        resolve({
          score,
          mate,
          bestMove,
        });
      }
    };

    sf.addEventListener(
      "message",
      handler
    );

    sf.postMessage("uci");

  });
}




export async function analysePositions(
    fens: string[],
    onProgress?: (current: number, total: number) => void
) {
    const evaluations: {
        score: number;
        mate: number | null;
        bestMove: string;
    }[] = [];

    for (let i = 0; i < fens.length; i++) {
        const evaluation = await getEvaluation(fens[i]);

        evaluations.push(evaluation);

        if (onProgress) {
            onProgress(
                i + 1,
                fens.length
            );
        }
    }

    return evaluations;
}