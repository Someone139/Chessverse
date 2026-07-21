const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const inputPath = path.join(
    process.cwd(),
    "data",
    "all.tsv"
);

const outputPath = path.join(
    process.cwd(),
    "lib",
    "openings.ts"
);

const file = fs.readFileSync(inputPath, "utf8");

const result = Papa.parse(file, {
    header: true,
    delimiter: "\t",
}).data;

const cleaned = result.filter(
    opening => opening.name
);

const output = 
`export const openings = ${JSON.stringify(cleaned, null, 4)};
`;

fs.writeFileSync(outputPath, output);

console.log("Generated openings.ts!");