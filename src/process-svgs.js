import fs from "fs";
import * as Path from "path";
import processSvg from "./process-svg";
const ROOT_URL = Path.join(__dirname, "..");
const ICON_PATH = "icons";

function readDirectory(path) {
  const dirPath = `${ROOT_URL}/${path}`;
  const res = fs.readdirSync(dirPath, "utf8");
  let paths = [];
  let files = [];
  res.map(res => {
    if (fs.lstatSync(`${path}/${res}`).isDirectory()) {
      paths.push(`${path}/${res}`);
    }
    if (
      fs.lstatSync(`${path}/${res}`).isFile() &&
      Path.extname(`${path}/${res}`) === ".svg"
    ) {
      files.push(`${path}/${res}`);
    }
  });
  return {
    files: [...files],
    pathTilCurrentDir: path,
    paths: [...paths]
  };
}

function handleFilesAndDirs(result) {
  if (Array.isArray(result.files) && result.files.length) {
    result.files.map(file => {
      const INPUT_URL = `${ROOT_URL}/${file}`;
      const OUTPUT_URL = `${ROOT_URL}/dist/${file}`;
      const PATH_TILL_CURRENT_DIR = `${ROOT_URL}/dist/${result.pathTilCurrentDir}`;
      processSvg(INPUT_URL, OUTPUT_URL, PATH_TILL_CURRENT_DIR);
    });
  }

  if (Array.isArray(result.paths) && result.paths.length) {
    let directories = [];
    result.paths.map(path => {
      directories.push(readDirectory(path));
    });
    directories.map(directory => {
      handleFilesAndDirs(directory);
    });
  }
  if (Array.isArray(result.paths) && !result.paths.length) {
    return null;
  }
}

handleFilesAndDirs(readDirectory(ICON_PATH));
