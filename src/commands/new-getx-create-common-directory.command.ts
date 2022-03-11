import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp from "mkdirp";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import { indexTemplate } from "../templates/getx-create-common-directory.template";

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

async function generateCode(pageName: string, targetDirectory: string) {
  const pageDirectoryPath = `${targetDirectory}/${pageName}`;
  if (!existsSync(pageDirectoryPath)) {
    // pages
    await createDirectory(`${targetDirectory}/pages`);
    indexTemplate("pages", targetDirectory);

    // common
    await createDirectory(pageDirectoryPath);
    await createDirectory(`${pageDirectoryPath}/i18n`);
    await createDirectory(`${pageDirectoryPath}/api`);
    await createDirectory(`${pageDirectoryPath}/models`);
    await createDirectory(`${pageDirectoryPath}/routers`);
    await createDirectory(`${pageDirectoryPath}/services`);
    await createDirectory(`${pageDirectoryPath}/style`);
    await createDirectory(`${pageDirectoryPath}/utils`);
    await createDirectory(`${pageDirectoryPath}/values`);
    await createDirectory(`${pageDirectoryPath}/widgets`);
    await createDirectory(`${pageDirectoryPath}/component`);

    await Promise.all([
      indexTemplate("i18n", pageDirectoryPath),
      indexTemplate("api", pageDirectoryPath),
      indexTemplate("models", pageDirectoryPath),
      indexTemplate("routers", pageDirectoryPath),
      indexTemplate("services", pageDirectoryPath),
      indexTemplate("style", pageDirectoryPath),
      indexTemplate("utils", pageDirectoryPath),
      indexTemplate("values", pageDirectoryPath),
      indexTemplate("widgets", pageDirectoryPath),
      indexTemplate("component", pageDirectoryPath),
    ]);
  }
}
