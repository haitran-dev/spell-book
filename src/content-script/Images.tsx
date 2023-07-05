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
    <div
      style={{
        columnCount: 2,
        backgroundColor: "#fff",
        gap: "8px",
        overflow: "auto",
        padding: "8px",
      }}
    >
      {isLoading ? (
        <>
          {range(1, 6).map((num) => (
            <div
              key={num}
              style={{
                height: 150 + num * 10 + "px",
                marginBottom: "8px",
                borderRadius: "4px",
                backgroundColor: "rgba(226, 232, 240, 0.2)",
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
  return (
    <img
      style={{
        borderRadius: "4px",
        width: "100%",
        marginBottom: "8px",
        boxShadow: "0 0 5px 1px rgba(0,0,0,0.2)",
      }}
      src={src}
    />
  );
};

export default Images;
