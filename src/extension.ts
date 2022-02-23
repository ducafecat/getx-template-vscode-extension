// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { newGetxPage } from "./commands/new-getx-page.command";
import { newGetxGetBuilderPage } from "./commands/new-getx-getbuilder-page.command";
import { newGetxStatefulWidgetGetBuilderPage } from "./commands/new-getx-stateful-getbuilder-page.command";

// import { commands, ExtensionContext, languages, workspace } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "getx-template" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('getx-template.helloWorld', () => {
  // 	// The code you place here will be executed every time your command is executed

  // 	// Display a message box to the user
  // 	vscode.window.showInformationMessage('Hello World from getx template!');
  // });
  // context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.new-getx-page", newGetxPage),
    vscode.commands.registerCommand(
      "extension.new-getx-getbuilder-page",
      newGetxGetBuilderPage
    ),
    vscode.commands.registerCommand(
      "extension.new-getx-stateful-getbuilder-page",
      newGetxStatefulWidgetGetBuilderPage
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
