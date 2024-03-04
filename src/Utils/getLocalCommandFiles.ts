import fetchFiles from "./fetchFiles";
import * as path from "path"
import { CommandObject } from "./CommandObjectClass"

export default (commandsPath: string): object[] => {
    let localCommandsArray: CommandObject[] = [];

    const commandsFolder: string[] = fetchFiles(path.join(commandsPath), true);
    for (const commandFolder of commandsFolder) {
        const commandFiles: string[] = fetchFiles(
            path.join(commandsPath, commandFolder)
        );
        for (const commandFile of commandFiles) {
            const commandObj: CommandObject = require(path.join(
                commandsPath, commandFolder, commandFile
            ));
            localCommandsArray.push(commandObj);
        }
    }
    return localCommandsArray;
}

