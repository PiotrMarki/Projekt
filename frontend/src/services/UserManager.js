import User from "./User.js";

class UserManager {
    constructor() {
        this.loggedInUser = null;
        this.loadSession();
    }

    async register(username, password) {
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to register user.");
            }

            alert("User registered successfully!");
        } catch (err) {
            console.error(err);
            throw new Error("Registration failed.");
        }
    }

    async login(username, password) {
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to log in.");
            }

            const data = await response.json();
            this.loggedInUser = { username: data.username };
            this.saveSession();
            alert("Login successful!");
        } catch (err) {
            console.error(err);
            throw new Error("Login failed.");
        }
    }

    saveSession() {
        if (this.loggedInUser) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
        }
    }

    loadSession() {
        const savedUser = sessionStorage.getItem("loggedInUser");
        if (savedUser) {
            this.loggedInUser = JSON.parse(savedUser);
        }
    }

    logout() {
        this.loggedInUser = null;
        sessionStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
    }
}

export default UserManager;
