import Room from '../modules/Room.js';
import Hotel from '../modules/Hotel.js';

test('getAvailableRooms() returns only available rooms', () => {
    const hotel = new Hotel('Test Hotel');
    const room = new Room(101, 'standard');
    const room2 = new Room(102, 'deluxe');
    const room3 = new Room(103, 'suite');
    const room4 = new Room(104, 'premium');
    hotel.addRoom(room);
    room.book();
    const available = hotel.getAvailableRooms();
    expect(available.length).toBe(0);
});