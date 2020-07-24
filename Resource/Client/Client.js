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
    }

    /* BASE CLIENT */
    get token() {
        return this._Memory.get().token;
    }

    /* DISCORD RELATED ACTIONS */
    getChannel(id) {
        return new TextChannel(this, String(id));
    }

    getGuild(id) {
        return new Guild(this, String(id));
    }
}

module.exports = Client;