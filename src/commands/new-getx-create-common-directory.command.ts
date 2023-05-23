import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp from "mkdirp";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, mkdirSync, writeFile } from "fs";
import {
  indexTemplate,
  index2Template,
  commonIndexTemplate,
  commonRouterNames,
  commonRouterPages,
  commonValuesConstants,
  commonValuesImages,
  commonValuesSvgs,
} from "../templates/getx-create-common-directory.template";

export const newGetxCommonDirectory = async (uri: Uri) => {
  console.log(uri);
  // const pageName = await promptForPageName();
  // if (_.isNil(pageName) || pageName.trim() === "") {
  //   window.showErrorMessage("The name must not be empty");
  //   return;
  // }

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  // const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    await generateCode("common", targetDirectory);
    window.showInformationMessage(`Successfully Generated Common Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

// function promptForPageName(): Thenable<string | undefined> {
//   const namePromptOptions: InputBoxOptions = {
//     prompt: "Input Page Name",
//     // placeHolder: "counter",
//   };
//   return window.showInputBox(namePromptOptions);
// }

// async function promptForTargetDirectory(): Promise<string | undefined> {
//   const options: OpenDialogOptions = {
//     canSelectMany: false,
//     openLabel: "Select a folder to create the page in",
//     canSelectFolders: true,
//   };

//   return window.showOpenDialog(options).then((uri) => {
//     if (_.isNil(uri) || _.isEmpty(uri)) {
//       return undefined;
//     }
//     return uri[0].fsPath;
//   });
// }

function createDirectory(targetDirectory: string): void {
  try {
    mkdirSync(targetDirectory, { recursive: true });
  } catch (error) {
    throw error;
  }
}

async function generateCode(pageName: string, targetDirectory: string) {
  const pageDirectoryPath = `${targetDirectory}/${pageName}`;
  if (!existsSync(pageDirectoryPath)) {
    // pages
    createDirectory(`${targetDirectory}/pages`);
    indexTemplate("pages", targetDirectory);

    // common
    createDirectory(pageDirectoryPath);
    createDirectory(`${pageDirectoryPath}/i18n`);
    createDirectory(`${pageDirectoryPath}/api`);
    createDirectory(`${pageDirectoryPath}/models`);
    createDirectory(`${pageDirectoryPath}/routers`);
    createDirectory(`${pageDirectoryPath}/services`);
    createDirectory(`${pageDirectoryPath}/style`);
    createDirectory(`${pageDirectoryPath}/utils`);
    createDirectory(`${pageDirectoryPath}/values`);
    createDirectory(`${pageDirectoryPath}/widgets`);
    createDirectory(`${pageDirectoryPath}/components`);
    createDirectory(`${pageDirectoryPath}/extension`);

    // 路由定义
    commonRouterNames(pageDirectoryPath);
    // 路由命名
    commonRouterPages(pageDirectoryPath);

    // 常量
    commonValuesConstants(pageDirectoryPath);
    commonValuesImages(pageDirectoryPath);
    commonValuesSvgs(pageDirectoryPath);

    // 目录索引 index.dart 文件
    indexTemplate("i18n", pageDirectoryPath);
    indexTemplate("api", pageDirectoryPath);
    indexTemplate("models", pageDirectoryPath);
    // indexTemplate("routers", pageDirectoryPath);
    indexTemplate("services", pageDirectoryPath);
    indexTemplate("style", pageDirectoryPath);
    indexTemplate("utils", pageDirectoryPath);
    // indexTemplate("values", pageDirectoryPath);
    indexTemplate("widgets", pageDirectoryPath);
    indexTemplate("components", pageDirectoryPath);
    indexTemplate("extension", pageDirectoryPath);
    commonIndexTemplate(pageDirectoryPath);

    index2Template(
      "routers",
      `
export 'names.dart';
export 'pages.dart';
    `,
      pageDirectoryPath
    );

    index2Template(
      "values",
      `
export 'constants.dart';
export 'images.dart';
export 'svgs.dart';
    `,
      pageDirectoryPath
    );

    // end
  }
}
