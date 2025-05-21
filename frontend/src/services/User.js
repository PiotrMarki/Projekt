class User {
    #password;

    constructor(username, password) {
        this.username = username;
        this.setPassword(password);
    }

    setPassword(password) {
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }
        this.#password = password;
    }

    validatePassword(password) {
        return this.#password === password;
    }

    toJSON() {
        return {
            username: this.username,
            password: this.#password
        };
    }

    static fromJSON(data) {
        return new User(data.username, data.password);
    }
}

export default User;
