import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var extension = new CreatioModifyDateChanger(context);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "creatio-modify-date-changer" is now active!');

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		extension.updateModifyDate(document);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}

class CreatioModifyDateChanger {
	private _context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this._context = context;
	}

	public updateModifyDate(document: vscode.TextDocument) : void {
		var dirPath = path.dirname(document.fileName);
		var descriptorPath = path.join(dirPath, 'descriptor.json');
		try {
			if (fs.existsSync(descriptorPath)) {
				let rawData = fs.readFileSync(descriptorPath, "utf8");
				var descriptorNew = rawData.replace(/Date\(([0-9])+\)/, this.getUtcDate());
				fs.writeFileSync(descriptorPath, descriptorNew);
			}
		} catch(err) {
			console.error(err)
		}
	}

	private getUtcDate() : string {
		var date = new Date();
		var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		var unixDate = Math.floor((utcDate).getTime() / 1000);
		return 'Date(' + unixDate + '000)';
	}
}