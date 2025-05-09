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
          this.rooms.forEach(room => {
              const match = saved.find(r => r.number === room.number);
              if (match) {
                  room.isAvailable = match.isAvailable;
                  room.bookedBy = match.bookedBy || null;
              }
          });
      }
  }
}

export default Hotel;
