import { createContext, useContext, useState, ReactNode } from "react";

export interface CardOrigin {
  top: number;
  left: number;
  width: number;
  height: number;
  accent: string;
}

interface CardTransitionContextValue {
  origin: CardOrigin | null;
  setOrigin: (origin: CardOrigin | null) => void;
}

const CardTransitionContext = createContext<CardTransitionContextValue>({
  origin: null,
  setOrigin: () => {},
});

export function CardTransitionProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<CardOrigin | null>(null);
  return (
    <CardTransitionContext.Provider value={{ origin, setOrigin }}>
      {children}
    </CardTransitionContext.Provider>
  );
}

export function useCardTransition() {
  return useContext(CardTransitionContext);
}
