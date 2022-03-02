import * as _ from "lodash";
import * as changeCase from "change-case";
import mkdirp from "mkdirp";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import {
  controllerTemplate,
  indexTemplate,
  viewTemplate,
} from "../templates/getx-getbuilder-page.template";

export const newGetxGetBuilderPage = async (uri: Uri) => {
  console.log(uri);
  const pageName = await promptForPageName();
  if (_.isNil(pageName) || pageName.trim() === "") {
    window.showErrorMessage("The name must not be empty");
    return;
  }

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    await generateCode(pageName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCasepageName} Getx Page`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForPageName(): Thenable<string | undefined> {
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input Page Name",
    // placeHolder: "counter",
  };
  return window.showInputBox(namePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the page in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
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

async function generateCode(pageName: string, targetDirectory: string) {
  const pageDirectoryPath = `${targetDirectory}/${pageName}`;
  if (!existsSync(pageDirectoryPath)) {
    await createDirectory(pageDirectoryPath);
    await createDirectory(`${pageDirectoryPath}/widgets`);

    await Promise.all([
      indexTemplate(pageName, targetDirectory),
      controllerTemplate(pageName, targetDirectory),
      viewTemplate(pageName, targetDirectory),
    ]);
  }
}
