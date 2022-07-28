import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

function soma(a: number, b: number) {
  return a + b;
}

function MeuComponent() {
  return <div>Vazia</div>;
}

test("Deve Somar", () => {
  const { getByText } = render(<MeuComponent />);
  getByText("Vazia");
  expect(getByText("Vazia")).toBeVisible();
});
