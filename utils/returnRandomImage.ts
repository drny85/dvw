const photos: { key: string; value: string }[] = [
  { key: "photo1", value: require("@/assets/images/feeds/1.jpg") },
  { key: "photo2", value: require("@/assets/images/feeds/2.jpg") },
  { key: "photo3", value: require("@/assets/images/feeds/3.jpg") },
  { key: "photo4", value: require("@/assets/images/feeds/4.jpg") },
  { key: "photo5", value: require("@/assets/images/feeds/5.jpg") },
  { key: "photo6", value: require("@/assets/images/feeds/6.jpg") },
  { key: "photo7", value: require("@/assets/images/feeds/7.jpg") },
  { key: "photo8", value: require("@/assets/images/feeds/8.jpg") },
  { key: "photo9", value: require("@/assets/images/feeds/9.jpg") },
  // Add more key-value pairs as needed
];

// Generate a random index to select a random photo
const randomIndex = Math.floor(Math.random() * photos.length);

// Get the selected photo object
export const selectedPhoto = photos[randomIndex];
