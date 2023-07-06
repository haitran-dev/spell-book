import ReactDOM from "react-dom/client";
import { extractData } from "../helpers/data-collect";
import App from "./App";
import { WidgetProvider } from "./WidgetContext";
import "./root.scss";
import React from "react";

export const ROOT_ID = "visual-english-ext";
const TRIGGER_ROOT_ID = "spell-book-ext-selection-point";

let currentWords = [];
let rootPoint: HTMLElement;
let selectedText = "";
let reactTriggerRoot: ReactDOM.Root;

const handlePopTab = (root: ReactDOM.Root, container) => {
  currentWords.pop();
  setTimeout(() => {
    root.unmount();

    if (currentWords.length === 0) {
      container.style.transform = "translateX(101%)";
    }
  }, 300);
};

const handleClear = (node) => {
  currentWords = [];
  node.style.transform = "translateX(101%)";
  setTimeout(() => {
    node.replaceChildren();
  }, 300);
};

const initApp = (data: object) => {
  let container: HTMLDivElement = document.querySelector(`#${ROOT_ID}`);

  if (!container) {
    container = document.createElement("div");
    container.id = ROOT_ID;
    document.body.appendChild(container);
  }

  container.style.transform = "translateX(0%)";
  const tab = document.createElement("div");
  container.appendChild(tab);
  const root = ReactDOM.createRoot(tab);

  root.render(
    <WidgetProvider>
      <App
        results={data}
        onGoBack={() => handlePopTab(root, container)}
        onClose={() => handleClear(container)}
        isFirstChild={currentWords.length === 1}
      />
    </WidgetProvider>,
  );
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "select") {
    let { word, sourceContent } = request.data;

    const textData = extractData(sourceContent, word);

    if (!textData) return;

    if (
      currentWords.length > 0 &&
      currentWords[currentWords.length - 1] === word
    )
      return;
    currentWords.push(word);

    initApp(textData);
  }
});

const handleTrigger = (selectedText: string) => {
  chrome.runtime.sendMessage({ action: "select-popup", text: selectedText });
};

const TriggerButton = ({ selectedText }) => {
  return (
    <div
      title="Lookup"
      className="lookup-btn"
      onClick={() => handleTrigger(selectedText)}
    >
      <img src={chrome.runtime.getURL("icon.png")} alt="Spell book" />
    </div>
  );
};

const handleDisableTrigger = () => {
  if (rootPoint) {
    rootPoint.style.display = "none";
  }
};

document.addEventListener("mouseup", (event) => {
  handleDisableTrigger();

  if (window.getSelection().toString() == selectedText) return;

  selectedText = window.getSelection().toString();
  if (!selectedText.trim() || selectedText.split(" ").length > 2) return;

  const { clientX, clientY } = event;

  rootPoint = document.getElementById(TRIGGER_ROOT_ID);

  if (!rootPoint) {
    rootPoint = document.createElement("div");
    rootPoint.id = TRIGGER_ROOT_ID;
    document.body.appendChild(rootPoint);
    reactTriggerRoot = ReactDOM.createRoot(rootPoint);
  }

  rootPoint.style.display = "block";
  rootPoint.style.top = clientY - 40 + "px";
  rootPoint.style.left = clientX + "px";

  reactTriggerRoot.render(<TriggerButton selectedText={selectedText} />);
});
