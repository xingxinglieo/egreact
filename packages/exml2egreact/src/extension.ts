// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import convert from "./convert";

const fs = vscode.workspace.fs;
async function translate(path: string) {
  const originUri = vscode.Uri.file(path);
  const exml = Buffer.from(await fs.readFile(originUri)).toString();

  const newFileUri = vscode.Uri.file(path.replace("exml", "tsx"));

  await fs.writeFile(newFileUri, new Uint8Array(Buffer.from(convert(exml))));
  try {
    const edit = new vscode.WorkspaceEdit();
    edit.set(
      newFileUri,
      await vscode.commands.executeCommand(
        "vscode.executeFormatDocumentProvider",
        newFileUri
      )
    );
    await vscode.workspace.applyEdit(edit);
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
        const originUri = vscode.Uri.file(path);

        const stat = await fs.stat(originUri);
        if (stat.type === vscode.FileType.Directory) {
          const files = await fs.readDirectory(originUri);
          const results = await Promise.allSettled(
            files
              .map(([file]) => path + "/" + file)
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
