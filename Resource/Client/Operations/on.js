function on(event, callback) {
    if (!event) throw new Error("Specify an event");
    if (typeof event !== "string") throw new Error("Event Must be a string");

    this["_" + event.toLowerCase()] = callback;
}

module.exports = on;