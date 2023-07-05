import React from "react";
import { extractImages } from "../helpers/data-collect";
import range from "../utils/range";

const Images = ({ word }) => {
  const [images, setImages] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "response-images") {
        const { sourceImages, keyword } = request.data;

        if (keyword !== word) return;

        const images = extractImages(sourceImages);
        setImages(images);
        setLoading(false);
      }
    });

    chrome.runtime.sendMessage({ action: "fetch-images", text: word });
  }, []);

  return (
    <div className="images-container">
      {isLoading ? (
        <>
          {range(1, 6).map((num) => (
            <div
              key={num}
              style={{
                height: 150 + num * 10 + "px",
                marginBottom: "8px",
                borderRadius: "4px",
                backgroundColor: "#ccc",
              }}
            />
          ))}
        </>
      ) : (
        <>
          {images.map((image) => {
            return <Image key={image.idx} src={image.source} />;
          })}
        </>
      )}
    </div>
  );
};

const Image = ({ src }) => {
  return <img className="spell-image" src={src} />;
};

export default Images;
