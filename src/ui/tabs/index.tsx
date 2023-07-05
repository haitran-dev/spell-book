import React, { useContext } from "react";

const TabContext = React.createContext(null);
const TabDispatchContext = React.createContext(null);

const Tabs = ({ defaultLabel, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultLabel);

  return (
    <TabContext.Provider value={activeTab}>
      <TabDispatchContext.Provider value={setActiveTab}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            height: "100%",
          }}
        >
          {children}
        </div>
      </TabDispatchContext.Provider>
    </TabContext.Provider>
  );
};

Tabs.Labels = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

Tabs.Label = ({ label }) => {
  const activeTab = React.useContext(TabContext);
  const setActiveTab = React.useContext(TabDispatchContext);
  const isActive = activeTab === label;

  return (
    <div
      style={{
        flex: 1,
        padding: "4px",
        textAlign: "center",
        borderRadius: "4px",
        border: "1px solid var(--color-line)",
        cursor: "pointer",
        ...(isActive && { backgroundColor: "hsl(203, 64%, 61%" }),
      }}
      onClick={() => setActiveTab(label)}
    >
      {label}
    </div>
  );
};

Tabs.Panels = ({ children }) => {
  return (
    <div
      style={{
        height: 0,
        flex: 1,
      }}
    >
      {children}
    </div>
  );
};

Tabs.Panel = ({ children, label }) => {
  const activeTab = React.useContext(TabContext);
  const isActive = activeTab === label;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...(isActive
          ? { visibility: "visible", height: "100%" }
          : { visibility: "hidden", height: 0 }),
      }}
    >
      {children}
    </div>
  );
};

export default Tabs;
