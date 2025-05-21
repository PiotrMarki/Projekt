class HotelAPI {
    static async fetchReviews() {
        const res = await fetch("http://localhost:3000/reviews");
        return await res.json();
    }
}

export default HotelAPI;
