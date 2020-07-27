/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Memory = require("../Modules/Memory.js");
const Config = require("../Modules/Config.js");

/* MANAGERS */
const EventManager = require("../Managers/EventManager.js");

/* CLASSES */
const TextChannel = require("../Classes/TextChannel.js");
const Guild = require("../Classes/Guild.js");

/* OPERATIONS */
const Login = require("./Operations/ClientLogin.js");
const On = require("./Operations/on.js");
const Emit = require("./Operations/emit.js");

class Client {
    constructor() {
        /* Client */
        this._Memory = new Memory();
        this._gateway = undefined;
        this._loggedin = false;
        this._data;

        /* CLIENT ACTIONS */
        this.login = Login.bind(this);
        this.on = On.bind(this);
        this.emit = Emit.bind(this);

        /* MANAGERS */
        this._eventmanager = new EventManager(this);

        /* 
        __EVENTS__
        _message
        _ready
        _messagedelete
        */

        /* DATA */
        // GUILD
        this._guilds = new Object();
        var newPrototype = JSON.parse(JSON.stringify(Object.prototype));
        newPrototype.find = function (match) {
            for (let value of Object.values(this))
                if (match(value))
                    return value;
        }
        newPrototype.size = function () {
            return Object.keys(this).length;
        }
        Object.setPrototypeOf(this._guilds, newPrototype);
    }

    /* BASE CLIENT */
    get token() {
        return this._Memory.get().token;
    }
    get guilds() {
        return this._guilds;
    }
    get id() {
        return this._data.id;
    }
    get username() {
        return this._data.username;
    }
    /* DISCORD RELATED ACTIONS */
    findChannel(match) {
        for (let value of Object.values(this._guilds))
            for (let channel of value.channels)
                if (match(channel))
                    return channel;
    }
}

module.exports = Client;