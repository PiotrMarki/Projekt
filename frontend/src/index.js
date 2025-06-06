import Hotel from "./modules/Hotel.js";
import Room from "./modules/Room.js";
import PremiumRoom from "./modules/PremiumRoom.js";
import UI from "./services/UI.js";
import HotelAPI from "./services/HotelAPI.js";
import UserManager from "./services/UserManager.js";
import './style.scss';

const userManager = new UserManager();
window.userManager = userManager; // żeby UI.js widział userManagera
userManager.loadSession();

const hotel = new Hotel("Grand Hotel");
hotel.loadFromLocalStorage();

if (hotel.rooms.length === 0) {
  hotel.addRoom(new Room(101, "single"));
  hotel.addRoom(new Room(102, "double"));
  hotel.addRoom(new PremiumRoom(201, "suite", "Free breakfast & spa access"));
  hotel.addRoom(new PremiumRoom(202, "deluxe", "All-inclusive meal plan"));
  hotel.saveToLocalStorage();
}

const ui = new UI(hotel);

async function loadRoomWithReviews() {
  let reviews = [];
  try {
    const response = await fetch("http://localhost:3000/reviews");
    reviews = await response.json();
  } catch (e) {
    console.warn("Could not load reviews", e);
  }
  ui.renderRooms(reviews);
}

loadRoomWithReviews();

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
    const response = await fetch('http://localhost:3000/reviews');
    const reviews = await response.json();
    const sample = reviews.filter((r) => Number(r.roomNumber) === Number(number)).slice(0, 3);
    reviewsContainer.innerHTML = 
      sample
        .map((r) => `
          <div id="review-${r.id}">
            <p><strong>${r.email}</strong>: ${r.body}</p>
            <button onclick="editReview('${r.id}')">Edit</button>
            <button onclick="deleteReview('${r.id}', ${r.roomNumber})">Delete</button>
          </div>
        `)
        .join("") || "No reviews yet.";
  } catch (err) {
    reviewsContainer.innerHTML = "<p style='color: red;'>Failed to load reviews.</p>";

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

document.addReview = async function () {
  const email = document.getElementById("reviewEmail").value.trim();
  const roomNumber = parseInt(document.getElementById("reviewRoom").value);
  const body = document.getElementById("reviewBody").value.trim();

  if (!email || isNaN(roomNumber) || !body) {
    alert("Invalid input");
    return;
  }

  const review = {
    email,
    roomNumber,
    body,
  };

  try {
    const response = await fetch("http://localhost:3000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    });

    if (!response.ok) {
      throw new Error("Failed to add review");
    }

    alert("Review added!");
    loadReviews(roomNumber);
  } catch (err) {
    console.error(err);
    alert("Failed to add review.");
  }
};

window.editReview = async function (id) {
  const email = prompt("New email:");
  const body = prompt("New review text:");
  const roomNumber = parseInt(prompt("Room number:"), 10);

  if (!email || !body || isNaN(roomNumber)) {
    alert("Invalid input");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, body, roomNumber }),
    });

    if (response.ok) {
      alert("Review updated!");
      loadReviews(roomNumber);
    } else {
      alert("Failed to update review.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while updating the review.");
  }
};

window.deleteReview = async function (id, roomNumber) {
  console.log("Deleting review with ID:", id, "for room:", roomNumber);
  const confirmed = confirm("Are you sure you want to delete this review?");
  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:3000/reviews/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Review deleted!");
      loadReviews(roomNumber);
    } else {
      alert("Failed to delete review.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while deleting the review.");
  }
};
