"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fetchFiles_1 = require("../Utils/fetchFiles");
;
class eventsHandler {
    constructor({ client, eventsPath }) {
        const eventFolders = (0, fetchFiles_1.default)(path.join(eventsPath), true);
        for (const eventFolder of eventFolders) {
            const eventFiles = (0, fetchFiles_1.default)(path.join(eventsPath, eventFolder), false);
            for (const eventFile of eventFiles) {
                const eventFunction = require(path.join(eventsPath, eventFolder, eventFile));
                const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
                client.on(eventName, async (...args) => {
                    eventFunction(client, ...args);
                });
            }
        }
    }
}
exports.default = eventsHandler;
