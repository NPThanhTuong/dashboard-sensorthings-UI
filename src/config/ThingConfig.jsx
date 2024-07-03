import hitech_ctu from "../../public/images/hitech-ctu.jpg";

const imageConfig = {
  1: "../../public/images/1.png",
  2: "../../public/images/2.png",
  9: "../../public/images/3.png",
};

export const getDefaultImage = () => hitech_ctu;

export const getImageForId = (id) => imageConfig[id] || getDefaultImage();
