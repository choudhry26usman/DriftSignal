import { createContext, useContext } from "react";

interface TourContextType {
  startTour: () => void;
  endTour: () => void;
  isTourActive: boolean;
}

export const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within TourProvider");
  }
  return context;
}
