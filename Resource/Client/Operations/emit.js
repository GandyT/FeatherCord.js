function emit(action, ...arg) {
    if (!this[`_${action}`]) return;
    this[`_${action}`](...arg);
}

module.exports = emit;