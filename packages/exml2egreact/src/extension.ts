// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs/promises";
import convert from "./convert";

async function translate(path: string) {
  const exml = await fs.readFile(path, { encoding: "utf-8" });
  const p = path.replace("exml", "tsx");
  await fs.writeFile(p, convert(exml));
  try {
    const uri = vscode.Uri.file(p);
    const edit = new vscode.WorkspaceEdit();
    edit.set(
      uri,
      await vscode.commands.executeCommand(
        "vscode.executeFormatDocumentProvider",
        uri
      )
    );
    vscode.workspace.applyEdit(edit);
  } catch (e) {
    const p = path.split("/");
    vscode.window.showWarningMessage(
      `${p[p.length - 1]} need to be fixed manually.`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "exml2egreact" is now active!');

  let disposable = vscode.commands.registerCommand(
    "exml2egreact.generate",
    async (info: { path: string }) => {
      try {
        const path = info.path;
        const stat = await fs.stat(path);
        if (stat.isDirectory()) {
          const files = await fs.readdir(path);
          const results = await Promise.allSettled(
            files
              .map((file) => path + "/" + file)
              .filter((filePath) => /\.exml$/.test(filePath))
              .map((filePath) => {
                return translate(filePath);
              })
          );

          const mark = { fulfilled: 0, rejected: 0 };
          results.forEach(({ status }) => mark[status]++);
          vscode.window.showInformationMessage(
            `exml2egreact: ${mark.fulfilled} file(s) success, ${mark.rejected} file(s) error.`
          );
        } else if (/\.exml$/.test(path)) {
          await translate(path);
          vscode.window.showInformationMessage("exml2egreact: Success!");
        } else {
          vscode.window.showErrorMessage("exml2egreact: It's no an exml file!");
        }
      } catch (e) {
        vscode.window.showErrorMessage(
          `exml2egreact: Sorry, something error.
          ${e.message}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
