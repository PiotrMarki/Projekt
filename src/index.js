import Hotel from "./modules/Hotel.js";
import Room from "./modules/Room.js";
import PremiumRoom from "./modules/PremiumRoom.js";
import UI from "./services/UI.js";
import HotelAPI from "./services/HotelAPI.js";
import UserManager from "./services/UserManager.js";
import './style.scss';

const hotel = new Hotel("Grand Hotel");
const userManager = new UserManager();
userManager.loadSession();
window.userManager = userManager;

if (userManager.loggedInUser) {
  document.getElementById("authStatus").innerText = `Logged in as: ${userManager.loggedInUser.username}`;
  document.getElementById("logoutBtn").style.display = "inline";
  document.getElementById("username").style.display = "none";
  document.getElementById("password").style.display = "none";
  document.querySelector("button[onclick='registerUser()']").style.display = "none";
  document.querySelector("button[onclick='loginUser()']").style.display = "none";
}

const room101 = new Room(101, "single");
const room102 = new Room(102, "double");
const room201 = new PremiumRoom(201, "suite", "Free breakfast & spa access");
const room202 = new PremiumRoom(202, "deluxe", "All-inclusive meal plan");

hotel.addRoom(room101);
hotel.addRoom(room102);
hotel.addRoom(room201);
hotel.addRoom(room202);

const ui = new UI(hotel);
hotel.loadFromLocalStorage();
ui.renderRooms();

window.bookRoom = function (number) {
  const room = hotel.rooms.find(r => r.number === number);
  if (!room || !room.isAvailable) return;

  if (!userManager.loggedInUser) {
    alert("You must be logged in to book a room.");
    return;
  }

  const cardNumber = prompt("Enter your credit card number (16 digits):");
  if (!room.setCreditCardNumber(cardNumber)) {
    alert("Invalid credit card number.");
    return;
  }

  room.bookedBy = userManager.loggedInUser.username;
  alert(`${room.book(userManager.loggedInUser.username)}\nBooked by: ${room.bookedBy}`);

  hotel.saveToLocalStorage();
  ui.renderRooms();
};

window.cancelBooking = function (number) {
  const room = hotel.rooms.find(r => r.number === number);
  if (
    room &&
    !room.isAvailable &&
    room.bookedBy === userManager.loggedInUser?.username
  ) {
    alert(room.cancelBooking());
    hotel.saveToLocalStorage();
    ui.renderRooms();
  }
};

window.loadReviews = async function (number) {
  const reviewsContainer = document.getElementById(`reviews-${number}`);
  reviewsContainer.innerHTML = "<p>Loading reviews...</p>";

  try {
    const reviews = await HotelAPI.fetchReviews();
    const randomReviews = reviews.sort(() => 0.5 - Math.random()).slice(0, 3);
    reviewsContainer.innerHTML = randomReviews.map(review =>
      `<p><strong>${review.email}:</strong> ${review.body}</p>`
    ).join("");
  } catch (err) {
    reviewsContainer.innerHTML = "<p style='color: red;'>Failed to load reviews.</p>";
    console.error("API error:", err);
  }
};

window.registerUser = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    userManager.register(username, password);
    alert("User registered successfully");
    userManager.login(username, password);
    document.getElementById("authStatus").innerText = `Logged in as: ${username}`;
    document.getElementById("logoutBtn").style.display = "inline";
    document.getElementById("username").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.querySelector("button[onclick='registerUser()']").style.display = "none";
    document.querySelector("button[onclick='loginUser()']").style.display = "none";

    hotel.saveToLocalStorage();
    ui.renderRooms();
  } catch (err) {
    alert(err.message);
  }
};

window.loginUser = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    userManager.login(username, password);
    alert("Login successful");
    document.getElementById("authStatus").innerText = `Logged in as: ${username}`;
    document.getElementById("logoutBtn").style.display = "inline";
    document.getElementById("username").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.querySelector("button[onclick='registerUser()']").style.display = "none";
    document.querySelector("button[onclick='loginUser()']").style.display = "none";

    hotel.saveToLocalStorage();
    ui.renderRooms();
  } catch (err) {
    alert(err.message);
  }
};

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("loggedInUser");
  location.reload();
});
