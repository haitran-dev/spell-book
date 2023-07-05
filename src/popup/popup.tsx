import React from "react";
import ReactDOM from "react-dom/client";
import "./popup.scss";

const Popup = () => {
  const [value, setValue] = React.useState("");

  const searchKeyword = (word: string) => {
    chrome.runtime.sendMessage({ action: "select-popup", text: word });
  };

  React.useEffect(() => {
    const handleKeydown = (e) => {
      if (e.keyCode === 13) {
        searchKeyword(value);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [value]);

  return (
    <div className="popup-container">
      <div className="overlay">
        <p className="popup-title">Lookup everything</p>
        <div className="input">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={() => searchKeyword(value)}>Search</button>
        </div>
      </div>
    </div>
  );
};

const container = document.createElement("div");
container.id = "popup-root";
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(<Popup />);
