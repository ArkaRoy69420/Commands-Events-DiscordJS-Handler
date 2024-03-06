"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandObject = void 0;
class CommandObject {
    name;
    description;
    options;
    forDevOnly;
    forTestGuildOnly;
    dm_permissions;
    botPermissionsRequired;
    userPermissionsRequired;
    deleted;
    callback;
    constructor({ name, description, options, forDevOnly = false, forTestGuildOnly = false, dm_permissions = true, botPermissionsRequired = [], userPermissionsRequired = [], deleted = false, callback, }) {
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
exports.CommandObject = CommandObject;
