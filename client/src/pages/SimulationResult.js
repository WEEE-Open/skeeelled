import { useLocation } from "react-router-dom";

export default function SimulationResult() {
  const locationState = useLocation().state;

  return (
    <>
      <h1>Simulation Result of {locationState.title}</h1>
    </>
  );
}
