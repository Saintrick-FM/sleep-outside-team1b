function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ReviewData {
  constructor() {
    this.path = "/json/reviews.json";
  }
  
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  
  async findReviewsByProductId(productId) {
    try {
      const reviewsData = await this.getData();
      const productReviews = reviewsData.find(item => item.productId === productId);
      return productReviews ? productReviews.reviews : [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }
  
  // In a real application, this would be a POST request to a server
  // For this demo, we're only implementing the front-end functionality
  async addReview(productId, reviewData) {
    // In a real app with a backend, this would be:
    // return fetch(`/api/products/${productId}/reviews`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(reviewData)
    // }).then(convertToJson);
    
    // For this demo, just alert that review was added (simulating success)
    alert("Review submitted successfully!");
    return { success: true };
  }
} 