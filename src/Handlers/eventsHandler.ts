import { Client } from "discord.js";
import * as path from "path";
import fetchFiles from "../Utils/fetchFiles";

interface paramsType {
    client: Client;
    eventsPath: string;
};

class eventsHandler {
  constructor({ client, eventsPath }: paramsType) {
    const eventFolders: string[] = fetchFiles(path.join(eventsPath), true);
    for (const eventFolder of eventFolders) {
      const eventFiles: string[] = fetchFiles(path.join(eventsPath, eventFolder), false);
      for (const eventFile of eventFiles) {
        const eventFunction: Function = require(path.join(eventsPath, eventFolder, eventFile));
        const eventName: any = eventFolder.replace(/\\/g, "/").split("/").pop();

        client.on(eventName, async (...args: any[]) => {
          eventFunction(client, ...args);
        });
      }
    }
  }
}

export default eventsHandler;