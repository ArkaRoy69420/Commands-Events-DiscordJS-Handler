This is a basic command handler made using discord.js v14, which is a popular & powerful node.js module for interacting with the discord api efficienctly. 
The work of this command and events handler is to seperate and command files and event files seperately so it's easy to maintain the code and keep it easy to comprehend.

How to use:
1. Clone the repo in your local folder.
2. Once done, run the following command in terminal "npm install"
3. After that, edit the token variable in .env file in root folder with your bot's actual token.
4. Then, in index.ts file, make the following changes:
   1. Edit commandsHandler class params with actual values for devsId array and testServer Id
      A recomended thing is to use a config.json file with testServer(string) and devs (string[]) and use it as params in commands Handler.

All set !
Also, to make commands, use the class CommandObject from src/Utils/CommandObjectClass as a blueprint. An example is given. 
For permissions, you need not use PermissionFlagsBits from discord.js. You can type "" and enter the permission name.

Happy Coding
