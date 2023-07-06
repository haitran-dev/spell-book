import React from "react";
import { WidgetContext, WidgetDispatchContext } from "./WidgetContext";

const Settings = () => {
  const widgets = React.useContext(WidgetContext);
  const dispatch = React.useContext(WidgetDispatchContext);

  const handleChangeWidgetValue = ({ target, value }) => {
    dispatch({
      type: "changed",
      target,
      value,
    });
  };

  return (
    <div
      style={{
        width: "300px",
        backgroundColor: "white",
        backdropFilter: "blur(6px)",
        border: "1px solid var(--color-line)",
        borderRadius: "4px",
        padding: "8px",
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        rowGap: "16px",
      }}
    >
      {widgets.map((widget) => {
        return (
          <label
            style={{
              fontWeight: 600,
              color: "14px",
            }}
            key={widget.name}
          >
            {widget.label}
            <input
              style={{
                boxShadow: "none",
                width: "auto",
              }}
              type={widget.type}
              value={widget.value}
              min={widget.min}
              max={widget.max}
              step={0.01}
              onChange={(e) =>
                handleChangeWidgetValue({
                  target: widget.name,
                  value: e.target.value,
                })
              }
            />
          </label>
        );
      })}
    </div>
  );
};

export default Settings;
