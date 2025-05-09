class Room {
    #creditCardNumber;

    constructor(number, type) {
        this.number = number;
        this.type = type;
        this.isAvailable = true;
        this.#creditCardNumber = null;
        this.bookedBy = null;
    }

    setCreditCardNumber(number) {
        const cardPattern = /^\d{16}$/;
        if (typeof number === "string" && cardPattern.test(number)) {
            this.#creditCardNumber = number;
            return true;
        }
        return false;
    }

    getMaskedCardNumber() {
        if (!this.#creditCardNumber) return "No card";
        return "**** **** **** " + this.#creditCardNumber.slice(-4);
    }

    book(username = "unknown") {
        this.isAvailable = false;
        this.bookedBy = username;
        return `Room ${this.number} is now booked by ${username}. Card: ${this.getMaskedCardNumber()}`;
    }

    cancelBooking() {
        const previousUser = this.bookedBy;
        this.isAvailable = true;
        this.#creditCardNumber = null;
        this.bookedBy = null;
        return `Room ${this.number} is now available again (previously booked by ${previousUser}).`;
    }

    toJSON() {
        return {
            number: this.number,
            type: this.type,
            isAvailable: this.isAvailable,
            bookedBy: this.bookedBy,
        };
    }
}

export default Room;
