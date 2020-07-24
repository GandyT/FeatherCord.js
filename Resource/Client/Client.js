/* INTERNAL MODULES */
const Memory = require("../Modules/Memory.js");

/* MANAGERS */
const EventManager = require("../Managers/EventManager.js");

/* CLASSES */
const TextChannel = require("../Classes/TextChannel.js");

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

        /* CLIENT ACTIONS */
        this.login = Login.bind(this);
        this.on = On.bind(this);
        this.emit = Emit.bind(this);

        /* MANAGERS */
        this._eventmanager = new EventManager(this);

        /* ACTIONS */
        this._message = undefined;
        this._ready = undefined;
    }

    /* BASE CLIENT */
    get token() {
        return this._Memory.get().token;
    }

    /* DISCORD RELATED ACTIONS */
    getChannel(id) {
        return new TextChannel(this, id);
    }
}

module.exports = Client;