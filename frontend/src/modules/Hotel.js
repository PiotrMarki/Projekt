import Room from "./Room.js";
import PremiumRoom from "./PremiumRoom.js";

class Hotel {
  constructor(name) {
      this.name = name;
      this.rooms = [];
  }

  addRoom(room) {
      this.rooms.push(room);
  }

  getAvailableRooms() {
      return this.rooms.filter(room => room.isAvailable);
  }

  saveToLocalStorage() {
      const data = this.rooms.map(room => room.toJSON());
      localStorage.setItem("hotelRooms", JSON.stringify(data));
  }

  loadFromLocalStorage() {
      const saved = JSON.parse(localStorage.getItem("hotelRooms"));
      if (Array.isArray(saved)) {
          this.rooms = saved.map(r => {
              // Jeśli masz PremiumRoom, możesz dodać warunek na premiumService
              if (r.premiumService) {
                  const room = new PremiumRoom(r.number, r.type, r.premiumService);
                  room.isAvailable = r.isAvailable;
                  room.bookedBy = r.bookedBy || null;
                  return room;
              } else {
                  const room = new Room(r.number, r.type);
                  room.isAvailable = r.isAvailable;
                  room.bookedBy = r.bookedBy || null;
                  return room;
              }
          });
      }
  }
}

export default Hotel;
