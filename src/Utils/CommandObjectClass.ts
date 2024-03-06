import { ApplicationCommandOptionType, Client, CommandInteraction, PermissionResolvable } from "discord.js";

interface Choice {
    name: string;
    value: any;
}
interface Option {
  name: string;
  description: string;
  required: boolean;
  type:
  | ApplicationCommandOptionType.Attachment
  | ApplicationCommandOptionType.Boolean
  | ApplicationCommandOptionType.Channel
  | ApplicationCommandOptionType.Integer
  | ApplicationCommandOptionType.Mentionable
  | ApplicationCommandOptionType.Number
  | ApplicationCommandOptionType.String
  | ApplicationCommandOptionType.User
  | ApplicationCommandOptionType.Role
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup
  | ApplicationCommandOptionType.Attachment;
  choices?: Choice[];
}


interface CommandObjectConstructorParams {
    name: string;
    description: string;
    options?: Option[];
    forDevOnly?: boolean;
    forTestGuildOnly?: boolean;
    dm_permissions?: boolean;
    botPermissionsRequired?: PermissionResolvable[];
    userPermissionsRequired?: PermissionResolvable[];
    deleted?: boolean;
    callback:  (client: Client, interaction: CommandInteraction) => Promise<void>;
}


export class CommandObject implements CommandObjectConstructorParams {
    name: string;
    description: string;
    options?: Option[];
    forDevOnly?: boolean;
    forTestGuildOnly?: boolean;
    dm_permissions?: boolean;
    botPermissionsRequired?: PermissionResolvable[];
    userPermissionsRequired?: PermissionResolvable[];
    deleted?: boolean;
    callback!: (client: Client, interaction: CommandInteraction) => Promise<void>;
    
    constructor({
        name, 
        description, 
        options, 
        forDevOnly = false, 
        forTestGuildOnly = false, 
        dm_permissions = true, 
        botPermissionsRequired = [], 
        userPermissionsRequired = [], 
        deleted = false,
        callback,
    }: CommandObjectConstructorParams) {
        this.name = name;
        this.description = description;
        this.options = options;
        this.forDevOnly = forDevOnly;
        this.forTestGuildOnly = forTestGuildOnly;
        this.dm_permissions = dm_permissions;
        this.botPermissionsRequired = botPermissionsRequired;
        this.userPermissionsRequired = userPermissionsRequired;
        this.deleted = deleted;
        this.callback = callback;
    }
}
