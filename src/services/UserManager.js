import User from "./User.js";

class UserManager {
    constructor() {
        this.users = [];
        this.loggedInUser = null;
        this.loadUsers();
    }

    register(username, password) {
        if (this.users.find(u => u.username === username)) {
            throw new Error("User already exists.");
        }
        const user = new User(username, password);
        this.users.push(user);
        this.saveUsers();
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username);
        if (!user || !user.validatePassword(password)) {
            throw new Error("Invalid username or password.");
        }
        this.loggedInUser = user;
        this.saveSession();  
    }

    saveUsers() {
        const data = this.users.map(u => u.toJSON());
        localStorage.setItem("users", JSON.stringify(data));
    }

    loadUsers() {
        const saved = JSON.parse(localStorage.getItem("users")) || [];
        this.users = saved.map(u => User.fromJSON(u));
    }

    saveSession() {
        if (this.loggedInUser) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser.toJSON()));
        }
    }

    loadSession() {
        const savedUser = sessionStorage.getItem("loggedInUser");
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            const user = this.users.find(u => u.username === userData.username);
            if (user) {
                this.loggedInUser = user;
            }
        }
    }

    logout() {
        this.loggedInUser = null;
        sessionStorage.removeItem("loggedInUser");
    }
}

export default UserManager;
