import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp from "mkdirp";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import {
  readdirSync,
  statSync,
  existsSync,
  readdir,
  stat,
  mkdirSync,
  lstatSync,
  writeFile,
  appendFileSync,
  rmSync,
} from "fs";
import * as path from "path";
// import * as Jimp from "jimp";
// import Jimp = require("jimp");
import Jimp from "jimp";

import * as vscode from "vscode";
import * as fs from "fs";
import { promisify } from "util";
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);
const unlinkAsync = promisify(fs.unlink);
const appendFileAsync = promisify(fs.appendFile);

var rootPath = "";

export const imageGenerate = async (uri: Uri) => {
  if (vscode.workspace.workspaceFolders) {
    rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  } else {
    vscode.window.showErrorMessage("没有打开的工作区！");
  }

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  // const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    // for (let mode = 1; mode < 4; mode++) {
    //   imageUtils.scaleImageToMode(destinationPath, imagePath, mode);
    // }

    // await generateCode("common", targetDirectory);

    // let fileList: string[] = [];
    // fileDisplay(targetDirectory, fileList);

    // for (const filePath of fileList) {
    //   console.log(filePath);
    // }

    /**/
    await imagesGen(targetDirectory);
    svgsGen(targetDirectory);

    window.showInformationMessage(`Successfully Generated Images Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

async function imagesGen(targetDirectory: string): Promise<void> {
  let isFirstIteration = true;

  const files = fs.readdirSync(targetDirectory, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      const subdirectory = path.join(targetDirectory, file.name);
      await imagesGen(subdirectory);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (![".jpeg", ".jpg", ".png"].includes(ext)) {
        continue;
      }

      const imgPath = path.parse(file.name);
      // const dirPath = imgPath.dir.toLowerCase();
      if (!targetDirectory.includes("3.0x")) {
        continue;
      }

      const workDir = path.resolve(targetDirectory, imgPath.dir, "..");
      console.log(file.name, workDir);

      // 创建 2.0x 目录
      if (isFirstIteration) {
        isFirstIteration = false;
        const filesTxtPath = path.join(workDir, "files.txt");
        if (await existsAsync(filesTxtPath)) {
          await unlinkAsync(filesTxtPath);
        }
      }

      // 缩放图片并写入文件列表
      const imgPath1x = path.join(workDir, file.name);
      const imgPath2x = path.join(workDir, "2.0x", file.name);
      const imgPath3x = path.join(targetDirectory, file.name);

      // 2x 目录
      const path2x = path.join(workDir, "2.0x");
      if (!(await existsAsync(path2x))) {
        await mkdirAsync(path2x);
      }

      // 1x 图片
      if (!(await existsAsync(imgPath1x))) {
        await scaleImage(imgPath1x, imgPath3x, 3);
      }

      // 2x 图片
      if (!(await existsAsync(imgPath2x))) {
        await scaleImage(imgPath2x, imgPath3x, 2);
      }

      // 加入记录
      const imgRelativePath = getRelativePath(imgPath1x, rootPath);
      await appendFileAsync(
        path.join(workDir, "files.txt"),
        `static const ${changeCase.camelCase(
          file.name
        )} = '${imgRelativePath}';\r\n`,
        { encoding: "utf8" }
      );
    }
  }
}

function svgsGen(targetDirectory: string): void {
  let isFirst = true;

  try {
    // Ensure targetDirectory exists before reading it
    if (!existsSync(targetDirectory)) {
      throw new Error(`Directory '${targetDirectory}' does not exist.`);
    }

    const fileNames = readdirSync(targetDirectory);

    for (const fileName of fileNames) {
      const filePath = path.join(targetDirectory, fileName);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        svgsGen(filePath);
      } else if (stats.isFile()) {
        const imgPath = path.parse(filePath);
        const lowExt = imgPath.ext.toLowerCase();
        if (lowExt !== ".svg") {
          continue;
        }

        const workDir = targetDirectory;
        const filesTxtPath = path.join(workDir, "files.txt");

        // Delete files.txt if it exists and isFirst is true
        if (isFirst) {
          isFirst = false;
          if (existsSync(filesTxtPath)) {
            rmSync(filesTxtPath);
          }
        }

        // Write to files.txt
        const svgName = changeCase.camelCase(imgPath.base);
        // const svgPath = path.join("assets/svgs", imgPath.base);
        const svgRelPath = getRelativePath(filePath, rootPath);
        appendFileSync(
          filesTxtPath,
          `static const ${svgName} = '${svgRelPath}';\n`,
          "utf8"
        );
      }
    }
  } catch (error: any) {
    console.error(`Error in svgsGen: ${error.message}`);
  }
}

function fileDisplay(filePath: string, fileList: string[]) {
  //根据文件路径读取文件，返回文件列表
  readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); //是文件
            var isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              // console.log(filedir);
              fileList.push(filedir);
            }
            if (isDir) {
              fileDisplay(filedir, fileList); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}

function walkSync(currentDirPath: string, callback: Function) {
  readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error: any) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

const scaleImage = (
  destinationImagePath: string,
  imagePath: string,
  scale: number
) => {
  return new Promise<void>((resolve, reject) => {
    Jimp.read(imagePath, (error, image) => {
      if (error) {
        reject(error);
        console.log(error);
        throw error;
      }
      let w = image.bitmap.width / scale;
      let h = image.bitmap.height / scale;
      image.resize(w, h).write(destinationImagePath);
      resolve();
    });
  });
};

const getRelativePath = (filePath: string, targetDirectory: string): string => {
  const relativePath = path.relative(targetDirectory, filePath);
  return relativePath.replace(/\\/g, "/");
};
