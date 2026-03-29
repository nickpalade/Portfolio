import React, { createContext, useContext } from "react";

type SectionContextType = {
  activeSection: string;
  setActiveSection: (s: string) => void;
};

export const SectionContext = createContext<SectionContextType>({
  activeSection: "#intro",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setActiveSection: () => {},
});

export const useSectionContext = () => useContext(SectionContext);

export const SectionProvider = SectionContext.Provider;

export default SectionContext;
