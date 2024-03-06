"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchFiles_1 = require("./fetchFiles");
const path = require("path");
exports.default = (commandsPath) => {
    let localCommandsArray = [];
    const commandsFolder = (0, fetchFiles_1.default)(path.join(commandsPath), true);
    for (const commandFolder of commandsFolder) {
        const commandFiles = (0, fetchFiles_1.default)(path.join(commandsPath, commandFolder));
        for (const commandFile of commandFiles) {
            const commandObj = require(path.join(commandsPath, commandFolder, commandFile));
            localCommandsArray.push(commandObj);
        }
    }
    return localCommandsArray;
};
