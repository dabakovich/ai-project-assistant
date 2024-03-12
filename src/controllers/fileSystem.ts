import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { EChangeType } from '../projectAssistant/enums';
import { IChange } from '../projectAssistant/types';

export class FileSystem {
  public rootDirectory: string;

  constructor(rootDirectory = './') {
    this.rootDirectory = path.resolve(rootDirectory);
  }

  public getRootDirectoryName() {
    return path.basename(this.rootDirectory);
  }

  // Open a folder. It returns array of folders/files in the opened folder
  public readFolder(folderName: string = './') {
    const folderPath = path.resolve(this.rootDirectory, folderName);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder ${folderName} does not exist`);
    }

    return fs.readdirSync(folderPath);
  }

  public createFolder(folderName: string) {
    const folderPath = path.resolve(this.rootDirectory, folderName);

    if (fs.existsSync(folderPath)) {
      throw new Error(`Folder ${folderName} already exists`);
    }

    fs.mkdirSync(folderPath);
  }

  // Read file content. It returns file content as a string, with number of rows at the beginning
  public readFile(fileName: string, isWithRowNumbers = false) {
    const filePath = path.resolve(this.rootDirectory, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${fileName} does not exist`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (!isWithRowNumbers) {
      return fileContent;
    }

    const fileContentLines = fileContent.split('\n');
    const fileContentWithRowNumbers = fileContentLines.map((line, index) => {
      return `${index + 1}| ${line}`;
    });

    return fileContentWithRowNumbers.join('\n');
  }

  public createFile(fileName: string, content: string) {
    const filePath = path.resolve(this.rootDirectory, fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      throw new Error(`File ${fileName} already exists`);
    }

    fs.writeFileSync(filePath, content);
  }

  // Update file content
  public editFile(fileName: string, changes: IChange[]) {
    const filePath = path.resolve(this.rootDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${fileName} does not exist`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileContentRows = fileContent.split('\n');

    // When we're making few changes in one file, we need to keep original row numbers,
    // because bot is giving us original row numbers for next changes
    let delta = 0;

    changes.forEach((change) => {
      // Bot is giving rows from 1, but we are counting from 0, so we need to subtract 1
      const startRow = change.startRow - 1 + delta;
      const endRow = (change.endRow ?? change.startRow) - 1 + delta;

      switch (change.type) {
        case EChangeType.add:
          fileContentRows.splice(startRow + 1, 0, change.content!);

          // We need to increase delta, because we added new row
          delta += 1;

          break;
        case EChangeType.remove:
          fileContentRows.splice(startRow, 1 + endRow - startRow);

          // We need to decrease delta, because we removed some rows
          delta -= 1 + endRow - startRow;
          break;
        case EChangeType.replace:
          fileContentRows.splice(startRow, 1 + endRow - startRow, change.content!);

          // We need to decrease delta, because we removed some rows, but replacing them with new one
          delta -= endRow - startRow;

          break;
        default:
          throw new Error(`Unknown change type: ${change.type}`);
      }
    });

    fs.writeFileSync(filePath, fileContentRows.join('\n'));
  }

  public rename(currentPath: string, newPath: string) {
    const fileOrFolderPath = path.resolve(this.rootDirectory, currentPath);
    const newFileOrFolderPath = path.resolve(this.rootDirectory, newPath);

    if (!fs.existsSync(fileOrFolderPath)) {
      throw new Error(`File or folder ${currentPath} does not exist`);
    }

    if (fs.existsSync(newFileOrFolderPath)) {
      throw new Error(`File or folder ${newPath} already exists`);
    }

    fs.renameSync(fileOrFolderPath, newFileOrFolderPath);
  }

  public remove(name: string) {
    const fileOrFolderPath = path.resolve(this.rootDirectory, name);

    if (!fs.existsSync(fileOrFolderPath)) {
      throw new Error(`File or folder ${name} does not exist`);
    }

    fs.rmSync(fileOrFolderPath, { recursive: true, force: true });
  }

  public async exec(command: string) {
    const { exec } = child_process;

    return new Promise<string>((resolve, reject) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          // console.debug(`error: ${error.message}`);
          reject(error);
        }

        // console.debug(`stderr: "${stderr}"`);
        // console.debug(`stdout: "${stdout}"`);
        resolve(stdout || stderr);
      });
    });
  }
}
