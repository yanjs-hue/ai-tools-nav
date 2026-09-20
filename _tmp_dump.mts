import { articleSpecs } from "./data/articleSpecs.ts";
import fs from "fs";

const slice = articleSpecs.slice(75);
fs.writeFileSync("./_tmp_specs75.json", JSON.stringify({
  total: articleSpecs.length,
  from75: slice.length,
  missingTo25: Math.max(0, 25 - slice.length),
  missingToIndex99: Math.max(0, 100 - articleSpecs.length),
  specs: slice,
}, null, 2), "utf8");
console.log("total", articleSpecs.length, "from75", slice.length);
slice.forEach((s, i) => console.log(75 + i, s.slug));
