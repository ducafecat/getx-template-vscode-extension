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

export const routersGenerate = async (uri: Uri) => {
  console.log(uri);

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  try {
    routeNamesGenerate(targetDirectory);
    routePagesGenerate(targetDirectory);

    window.showInformationMessage(
      `Successfully Generated Getx Routers Text File`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function getRootPath(resource: Uri | undefined): string | undefined {
  let path: string | undefined;
  let workspace = vscode.workspace;
  if (!workspace.workspaceFolders) {
    path = workspace.rootPath;
  } else {
    let root: vscode.WorkspaceFolder | undefined;
    if (workspace.workspaceFolders.length === 1) {
      root = workspace.workspaceFolders[0];
    } else {
      if (resource !== null) {
        root = workspace.getWorkspaceFolder(resource!);
      }
    }
    path = root?.uri.fsPath;
  }
  return path;
}

// 生成 route names
function routeNamesGenerate(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    // 根目录
    let rootPath = getRootPath(undefined);

    // 相对路径
    let relativePath = vscode.workspace.asRelativePath(filePath);

    // 检查 lib/pages
    if (relativePath.indexOf("lib/pages/") === -1) {
      return;
    }

    // 检查 index.dart
    if (relativePath.indexOf("/index.dart") === -1) {
      return;
    }

    // 名称
    let arrFilePath = relativePath
      .replace("lib/pages/", "")
      .replace("/index.dart", "")
      .split("/");
    const modalFileName = arrFilePath.join("_");
    const filePathName = arrFilePath.join("/");
    const pascalCaseName = changeCase.pascalCase(modalFileName);
    const snakeCaseName = changeCase.snakeCase(modalFileName);
    const camelCaseName = changeCase.camelCase(modalFileName);

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${rootPath}/lib/common/routes/names.txt`)) {
        rmSync(`${rootPath}/lib/common/routes/names.txt`);
      }
      if (existsSync(`${rootPath}/lib/common/routes/pages.txt`)) {
        rmSync(`${rootPath}/lib/common/routes/pages.txt`);
      }
      if (existsSync(`${rootPath}/lib/pages/index.txt`)) {
        rmSync(`${rootPath}/lib/pages/index.txt`);
      }
    }
    // 写入列表
    appendFileSync(
      `${rootPath}/lib/common/routes/names.txt`,
      `static const ${camelCaseName} = '/${snakeCaseName}';\r\n`,
      "utf8"
    );
    appendFileSync(
      `${rootPath}/lib/common/routes/pages.txt`,
      `
      GetPage(
        name: RouteNames.${camelCaseName},
        page: () => const ${pascalCaseName}Page(),
      ),`,
      "utf8"
    );
    appendFileSync(
      `${rootPath}/lib/pages/index.txt`,
      `export '${filePathName}/index.dart';\r\n`,
      "utf8"
    );
  });
}

// 生成 route pages
function routePagesGenerate(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    // 根目录
    let rootPath = getRootPath(undefined);

    // 相对路径
    let relativePath = vscode.workspace.asRelativePath(filePath);

    // 检查 lib/pages
    if (relativePath.indexOf("lib/pages/") === -1) {
      return;
    }

    // 检查 index.dart
    if (relativePath.indexOf("/index.dart") === -1) {
      return;
    }

    // 名称
    let arrFilePath = relativePath
      .replace("lib/pages/", "")
      .replace("/index.dart", "")
      .split("/");
    let modalFileName = arrFilePath.join("_");
    // const pascalCaseName = changeCase.pascalCase(modalFileName);
    const snakeCaseName = changeCase.snakeCase(modalFileName);
    const camelCaseName = changeCase.camelCase(modalFileName);

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${rootPath}/lib/common/routes/names.txt`)) {
        rmSync(`${rootPath}/lib/common/routes/names.txt`);
      }
    }
    // 写入列表
    appendFileSync(
      `${rootPath}/lib/common/routes/names.txt`,
      `static const ${camelCaseName} = '/${snakeCaseName}';\r\n`,
      "utf8"
    );
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
