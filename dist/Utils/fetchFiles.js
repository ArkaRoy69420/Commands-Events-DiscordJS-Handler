"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (directory, onlyFolders = false) => {
    const fs = require("fs");
    const path = require("path");
    const files = fs.readdirSync(directory);
    if (onlyFolders) {
        const folders = files.filter((file) => fs.statSync(path.join(directory, file)).isDirectory());
        return folders;
    }
    return files;
};
