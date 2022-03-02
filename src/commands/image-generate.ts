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

    // let fileList: string[] = [];
    // fileDisplay(targetDirectory, fileList);

    // for (const filePath of fileList) {
    //   console.log(filePath);
    // }

    /**/
    imagesGen(targetDirectory);
    svgsGen(targetDirectory);

    window.showInformationMessage(`Successfully Generated Images Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function imagesGen(targetDirectory: string) {
  let isFirst = true;
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

    if (!existsSync(`${workDir}/${imgPath.base}`)) {
      await scaleImage(`${workDir}/${imgPath.base}`, filePath, 0.25);
    }
    if (!existsSync(`${workDir}/2.0x/${imgPath.base}`)) {
      await scaleImage(`${workDir}/2.0x/${imgPath.base}`, filePath, 0.5);
    }

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${workDir}/files.txt`)) {
        rmSync(`${workDir}/files.txt`);
      }
    }
    // 写入列表
    appendFileSync(
      `${workDir}/files.txt`,
      `static const ${changeCase.camelCase(imgPath.base)} = 'assets/images/${
        imgPath.base
      }';\r\n`,
      "utf8"
    );
  });
}

function svgsGen(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    var imgPath = path.parse(filePath);
    let lowExt = imgPath.ext.toLowerCase();
    if (lowExt !== ".svg") {
      return;
    }

    let workDir = imgPath.dir;

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${workDir}/files.txt`)) {
        rmSync(`${workDir}/files.txt`);
      }
    }
    // 写入列表
    appendFileSync(
      `${workDir}/files.txt`,
      `static const ${changeCase.camelCase(imgPath.base)} = 'assets/svgs/${
        imgPath.base
      }';\r\n`,
      "utf8"
    );
  });
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
      image.scale(scale).write(destinationImagePath);
      resolve();
    });
  });
};
