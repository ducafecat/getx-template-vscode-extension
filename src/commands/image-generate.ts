import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp from "mkdirp";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  lstatSync,
  writeFile,
} from "fs";
import * as path from "path";
// import * as Jimp from "jimp";
// import Jimp = require("jimp");
import Jimp from "jimp";

export const imageGenerate = async (uri: Uri) => {
  console.log(uri);

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  // const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    // for (let mode = 1; mode < 4; mode++) {
    //   imageUtils.scaleImageToMode(destinationPath, imagePath, mode);
    // }

    // await generateCode("common", targetDirectory);
    walkSync(targetDirectory, async (filePath: string, stat: object) => {
      var imgPath = path.parse(filePath);
      let lowExt = imgPath.ext.toLowerCase();
      if (
        lowExt !== ".jpeg" &&
        lowExt !== ".jpg" &&
        lowExt !== ".png"
        // imgPath.dir.toLowerCase().indexOf("3.0x") === -1
      ) {
        return;
      }

      let find3x = imgPath.dir.toLowerCase().indexOf("/3.0x");
      if (find3x === -1) {
        return;
      }

      let workDir = path.resolve(imgPath.dir, ".."); // 上一级目录
      console.log(filePath, workDir);

      // 创建 2.0x 1.0x
      if (!existsSync(`${workDir}/2.0x`)) {
        createDirectory(`${workDir}/2.0x`);
      }

      await scaleImage(`${workDir}/${imgPath.base}`, filePath, 0.25);
      await scaleImage(`${workDir}/2.0x/${imgPath.base}`, filePath, 0.5);

      // if (
      //   !filePath.endsWith(".jpeg") &&
      //   !filePath.endsWith(".jpg") &&
      //   !filePath.endsWith(".png") &&
      //   filePath.indexOf("3.0x") < 0
      // ) {
      //   return;
      // }

      // console.log(filePath, stat);
    });

    window.showInformationMessage(`Successfully Generated Images Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

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
      image.scale(scale).write(destinationImagePath);
      resolve();
    });
  });
};
