import path = require("path");

export default (directory: string, onlyFolders: boolean = false) => {
    const fs = require("fs");
    const path = require("path");
    const files = fs.readdirSync(directory);
  
    if (onlyFolders) {
      const folders = files.filter((file: File) =>
        fs.statSync(path.join(directory, file)).isDirectory()
      );
      return folders;
    }
  
    return files;
}