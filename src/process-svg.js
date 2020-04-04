import fs from "fs";
const { parse, stringify } = require("svgson");
import svgToPath from "path-that-svg";
import defaultAttrs24 from "./default-attrs/24";
import defaultAttrs16 from "./default-attrs/16";
// processing single svg
function processSvg(INPUT_URL, OUTPUT_URL, pathTilCurrentDir) {
  fs.mkdirSync(pathTilCurrentDir, {
    recursive: true
  });
  const file = fs.readFileSync(INPUT_URL, "utf8");
  parseFile(file).then(res => {
    const { attributes } = res;
    if (checkForIconSizes(attributes)) {
      res.attributes = checkForIconSizes(attributes);
    }
    const svg = stringify(res);
    fs.writeFileSync(OUTPUT_URL, svg, { encoding: "utf8" });
  });
}

async function parseFile(file) {
  return await parse(file).then(json => {
    return json;
  });
}

function checkForIconSizes(attributes) {
  const { height, width, viewBox } = attributes;
  const isIcon24 =
    attributes.hasOwnProperty("width") &&
    width === "24" &&
    (attributes.hasOwnProperty("height") && height === "24") &&
    (attributes.hasOwnProperty("viewBox") && viewBox === "0 0 24 24");
  const isIcon16 =
    attributes.hasOwnProperty("width") &&
    width === "16" &&
    (attributes.hasOwnProperty("height") && height === "16") &&
    (attributes.hasOwnProperty("viewBox") && viewBox === "0 0 16 16");
  if (isIcon16) {
    return defaultAttrs16;
  } else if (isIcon24) {
    return defaultAttrs24;
  } else {
    return null;
  }
}

export default processSvg;
