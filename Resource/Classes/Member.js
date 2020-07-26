class Member {
    constructor(data) {
        this._data = data;
    }
    user() {
        return this._data.user;
    }
}

module.exports = Member;