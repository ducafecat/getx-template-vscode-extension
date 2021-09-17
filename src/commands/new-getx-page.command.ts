import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import { bindingsTemplate, controllerTemplate, indexTemplate, stateTemplate, viewTemplate, widgetsMainViewTemplate, widgetsTemplate } from "../templates/getx-page.template";

const configPrefixFileName = 'GetxTemplate.PrefixFileName';
const configSelectPathInOpenDialog = 'GetxTemplate.SelectPathInOpenDialog';

export const newGetxPage = async (uri: Uri) => {
  console.log(uri);

  const pageName = await promptForClassName();
  if (_.isNil(pageName) || pageName.trim() === "") {
    window.showErrorMessage("The name must not be empty");
    return;
  }
  var prefix = '';
  const isPrefixFileName = vscode.workspace.getConfiguration().get(configPrefixFileName);
  if (isPrefixFileName) {
    const inputPrefix = await promptForPrefix(pageName.toLowerCase());
    if (inputPrefix !== undefined) {
      prefix = inputPrefix;
    }
  }

  var targetDirectory = '';

  if (uri === undefined) {
    const isOpenDialog = vscode.workspace.getConfiguration().get(configSelectPathInOpenDialog);
    if (isOpenDialog) {
      const selectPath = await promptForTargetDirectoryInDialog();
      if (selectPath !== undefined) {
        targetDirectory = selectPath;
      }
    }else {
      let workspaceFolders = vscode.workspace.workspaceFolders;
      if(workspaceFolders !== undefined && workspaceFolders.length !== 0) {
        const defaultPath = workspaceFolders![0].uri.fsPath + '/lib/pages';
        const selectPath = await promptForTargetDirectory(defaultPath);
        if (selectPath !== undefined) {
          targetDirectory = selectPath!;
        }
      }
    }
    
  }else {
    targetDirectory = uri.fsPath;
  }
  
  console.log(targetDirectory);
  if (targetDirectory.trim() === '') {
    window.showErrorMessage("targetDirectory error");
    return;
  }


  const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    await generateCode(pageName, prefix, targetDirectory);
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


function promptForClassName(): Thenable<string | undefined> {
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input Class Name",
    placeHolder: "Input Class Name",
  };
  return window.showInputBox(namePromptOptions);
}

function promptForPrefix(defaultValue:string): Thenable<string | undefined> {
  const snakeCasePrefix = changeCase.snakeCase(defaultValue);
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input Prefix",
    placeHolder:"Input Prefix",
    value:snakeCasePrefix
  };
  return window.showInputBox(namePromptOptions);
}

function promptForTargetDirectory(defaultValue:string): Thenable<string | undefined> {
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input Target Directory",
    placeHolder:"Input Target Directory",
    value:defaultValue
  };
  return window.showInputBox(namePromptOptions);
}

async function promptForTargetDirectoryInDialog(): Promise<string | undefined> {
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
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

async function generateCode(
  pageName: string,
  prefix: string,
  targetDirectory: string
) {
  const pageDirectoryPath = `${targetDirectory}/${prefix}`;
  if (!existsSync(pageDirectoryPath)) {
    await createDirectory(pageDirectoryPath);
    await createDirectory(`${pageDirectoryPath}/widgets`);
  }

  await Promise.all([
    indexTemplate(pageName, prefix, targetDirectory),
    stateTemplate(pageName, prefix, targetDirectory),
    controllerTemplate(pageName, prefix, targetDirectory),
    bindingsTemplate(pageName, prefix, targetDirectory),
    viewTemplate(pageName, prefix, targetDirectory),
    widgetsTemplate(pageName, prefix, targetDirectory),
    widgetsMainViewTemplate(pageName, prefix, targetDirectory),
  ]);
}
