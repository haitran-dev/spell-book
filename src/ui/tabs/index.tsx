import React, { useContext } from "react";

const TabContext = React.createContext(null);
const TabDispatchContext = React.createContext(null);

const Tabs = ({ defaultLabel, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultLabel);

  return (
    <TabContext.Provider value={activeTab}>
      <TabDispatchContext.Provider value={setActiveTab}>
        <div className="tab-container">{children}</div>
      </TabDispatchContext.Provider>
    </TabContext.Provider>
  );
};

Tabs.Labels = ({ children }) => (
  <div className="tab-label-container">{children}</div>
);

Tabs.Label = ({ label }) => {
  const activeTab = React.useContext(TabContext);
  const setActiveTab = React.useContext(TabDispatchContext);
  const isActive = activeTab === label;

  return (
    <div
      className="tab-label"
      data-is-active={!!isActive}
      onClick={() => setActiveTab(label)}
    >
      <div className="tab-label-bottom" />
      <div className="tab-label-content">{label}</div>
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
