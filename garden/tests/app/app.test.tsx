import { it } from "vitest";
import App from "@/app/app";
import { renderWithProviders } from "@tests/setupTests";

it("renders", () => {
  renderWithProviders(<App />);
});
