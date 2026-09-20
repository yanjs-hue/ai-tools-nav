import fs from "fs";

const text = fs.readFileSync("./data/articleSpecs.ts", "utf8");
const fileSlugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log("file slug count:", fileSlugs.length);
console.log("---75 to end---");
fileSlugs.slice(75).forEach((s, i) => console.log(75 + i + ":" + s));
console.log("count from 75:", fileSlugs.slice(75).length);
console.log("missing to 100 indices (75-99 = 25):", Math.max(0, 25 - fileSlugs.slice(75).length));
