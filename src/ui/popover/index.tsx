import React from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const PopoverContext = React.createContext<boolean>(null);
const PopoverDispatchContext = React.createContext(null);

const Popover = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const rootRef = useOnClickOutside(() => setOpen(false));

  return (
    <PopoverContext.Provider value={isOpen}>
      <PopoverDispatchContext.Provider value={setOpen}>
        <div ref={rootRef}>{children}</div>
      </PopoverDispatchContext.Provider>
    </PopoverContext.Provider>
  );
};

Popover.Trigger = ({ children }: { children: React.ReactNode }) => {
  const togglePopover = React.useContext(PopoverDispatchContext);

  return (
    <div
      onClick={() =>
        togglePopover((state: boolean) => {
          return !state;
        })
      }
    >
      {children}
    </div>
  );
};

Popover.Body = ({ children }: { children: React.ReactNode }) => {
  const isOpen = React.useContext(PopoverContext);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        right: 0,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

export default Popover;
