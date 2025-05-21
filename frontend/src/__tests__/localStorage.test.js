import Hotel from '../modules/Hotel.js';
import Room from '../modules/Room.js';

beforeEach(() => {
    global.localStorage = {
        data: {},
        getItem(key) {
            return this.data[key] || null;
        },
        setItem(key, value) {
            this.data[key] = value;
        },
        clear() {
            this.data = {};
        }
    };
});

test('saveToLocalStorage() and loadFromLocalStorage() work correctly', () => {
    const hotel = new Hotel('Test Hotel');

    const room1 = new Room(101, 'standard');
    const room2 = new Room(102, 'deluxe');
    room2.book(); 
    hotel.addRoom(room1);
    hotel.addRoom(room2);

    hotel.saveToLocalStorage();

    const newHotel = new Hotel('Test Hotel');
    newHotel.loadFromLocalStorage();

    expect(newHotel.rooms.length).toBe(2);

    const loadedRoom1 = newHotel.rooms[0];
    const loadedRoom2 = newHotel.rooms[1];

    expect(loadedRoom1.number).toBe(101);
    expect(loadedRoom1.type).toBe('standard');
    expect(loadedRoom1.isAvailable).toBe(true);

    expect(loadedRoom2.number).toBe(102);
    expect(loadedRoom2.type).toBe('deluxe');
    expect(loadedRoom2.isAvailable).toBe(false);
});