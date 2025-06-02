class UI {
    constructor(hotel) {
      this.hotel = hotel;
    }
  
    renderRooms(reviews = []) {
      const container = document.getElementById("roomsContainer");
      container.innerHTML = "";
  
      const isLoggedIn = window.userManager && window.userManager.loggedInUser;
      const loggedInUsername = isLoggedIn ? window.userManager.loggedInUser.username : null;
  
      this.hotel.rooms.forEach(room => {
        const roomDiv = document.createElement("div");
        roomDiv.classList.add("room");
  
        if (!room.isAvailable) roomDiv.classList.add("booked");
        else roomDiv.classList.add("available");
  
        if (room.premiumService) roomDiv.classList.add("premium-room");
  
        const bookedByInfo = room.bookedBy
          ? `<p><strong>Booked by:</strong> ${room.bookedBy}</p>`
          : "";
  
        const canBook = room.isAvailable && isLoggedIn;
        const canCancel = !room.isAvailable && room.bookedBy === loggedInUsername;
  
        const reviewCount = reviews.filter(
          (r) => r.roomNumber === room.number
        ).length;
        const reviewInfo = 
          reviewCount === 0
            ? `<p><strong>Reviews:</strong> No reviews yet</p>`
            : `<p><strong>Reviews:</strong> ${reviewCount}</p>`;

        roomDiv.innerHTML = `
          <h3>Room ${room.number} (${room.type})</h3>
          <p>Status: ${room.isAvailable ? "Available" : "Booked"}</p>
          ${room.premiumService ? `<p><strong>Service:</strong> ${room.premiumService}</p>` : ""}
          ${bookedByInfo}
          ${reviewInfo}
          <button onclick="bookRoom(${room.number})" ${canBook ? "" : "disabled"}>Book</button>
          <button onclick="cancelBooking(${room.number})" ${canCancel ? "" : "disabled"}>Cancel</button>
          <button class="load-reviews-btn" data-id="${room.number}">Load Reviews</button>
          <div id="reviews-${room.number}" class="reviews"></div>
        `;
  
        container.appendChild(roomDiv);
      });
  
      document.querySelectorAll(".load-reviews-btn").forEach(button => {
        button.addEventListener("click", () => {
          const roomNumber = button.getAttribute("data-id");
          loadReviews(roomNumber);
        });
      });
    }
  }
  
  export default UI;
  