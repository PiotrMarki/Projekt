import Room from "./Room.js";

class PremiumRoom extends Room {
    constructor(number, type, premiumService) {
        super(number, type);
        this.premiumService = premiumService;
    }

    getServiceDetails() {
        return `Premium service for room ${this.number}: ${this.premiumService}`;
    }
}

export default PremiumRoom;
