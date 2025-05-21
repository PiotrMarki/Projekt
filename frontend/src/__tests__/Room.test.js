import Room from '../modules/Room.js';

test('booking a room sets isAvailable to false', () => {
    const room = new Room(101, 'standard');
    room.book();
    room.cancelBooking();
    expect(room.isAvailable).toBe(true);
});