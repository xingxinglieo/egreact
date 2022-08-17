// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as prettier from "prettier";
import { convert } from "./convert";
import {
  handleTag,
  handlePropTag,
  handleComment,
  handleConditionProps,
  handleSpecialProps,
  handleNativeValue,
  handleSkin,
  handleVariable,
  htmlDecode
} from "./plugins";

const t = (exml: string) =>
  convert(exml, [
    handleVariable,
    handleSkin,
    handleTag,
    handlePropTag,
    handleComment,
    handleConditionProps,
    handleSpecialProps,
    handleNativeValue,
    htmlDecode
  ]);

async function translate(path: string) {
  const exml = await fs.readFile(path, { encoding: "utf-8" });
  const options = await prettier.resolveConfig(path).catch(() => ({} as any));
  options.parser = "babel-ts";
  let jsx: string;
  try {
    jsx = prettier.format(t(exml), options);
  } catch (e) {
    jsx = t(exml);
    const p = path.split("/");
    vscode.window.showWarningMessage(
      `${p[p.length - 1]} need to be fixed manually.`
    );
  }
  fs.writeFile(path.replace("exml", "tsx"), jsx);
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
