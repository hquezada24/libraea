// Button.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Button from "./Button";
import styles from "./Button.module.css";

describe("Button component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderButton = (props) => {
    return render(
      <BrowserRouter>
        <Button {...props} />
      </BrowserRouter>
    );
  };

  it("renders button with text", () => {
    renderButton({ text: "Click Me" });

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders as a link when link prop is provided", () => {
    renderButton({ text: "Go Home", link: "/" });

    const link = screen.getByRole("link", { name: "Go Home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders as a span when no link prop is provided", () => {
    renderButton({ text: "No Link" });

    const span = screen.getByText("No Link");
    expect(span.tagName).toBe("SPAN");
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderButton({ text: "Click Me", onClick: handleClick });

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders without onClick and does not throw error on render", () => {
    renderButton({ text: "No Handler" });

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders with both link and onClick", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderButton({ text: "Link Button", link: "/about", onClick: handleClick });

    const button = screen.getByRole("button");
    const link = screen.getByRole("link", { name: "Link Button" });

    expect(link).toHaveAttribute("href", "/about");

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with correct button class", () => {
    const { container } = renderButton({ text: "Test" });

    const button = container.querySelector(`.${styles.button}`);
    expect(button).toBeInTheDocument();
  });

  it("renders link with correct class when link is provided", () => {
    const { container } = renderButton({ text: "Test", link: "/" });

    const link = container.querySelector(`.${styles.link}`);
    expect(link).toBeInTheDocument();
  });

  it("renders span with correct class when no link is provided", () => {
    const { container } = renderButton({ text: "Test" });

    const span = container.querySelector(`.${styles.span}`);
    expect(span).toBeInTheDocument();
  });

  it("handles empty string link prop", () => {
    renderButton({ text: "Empty Link", link: "" });

    const span = screen.getByText("Empty Link");
    expect(span.tagName).toBe("SPAN");
  });

  it("renders with different link paths", () => {
    const { rerender } = render(
      <BrowserRouter>
        <Button text="Home" link="/" />
      </BrowserRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/");

    rerender(
      <BrowserRouter>
        <Button text="Search" link="/search" />
      </BrowserRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/search");

    rerender(
      <BrowserRouter>
        <Button text="Library" link="/my-library" />
      </BrowserRouter>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/my-library");
  });

  it("handles special characters in text", () => {
    renderButton({ text: "Click Me & Save!" });

    expect(screen.getByText("Click Me & Save!")).toBeInTheDocument();
  });

  it("button is accessible", () => {
    renderButton({ text: "Accessible Button" });

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName("Accessible Button");
  });

  it("link inside button is accessible", () => {
    renderButton({ text: "Accessible Link", link: "/test" });

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAccessibleName("Accessible Link");
  });

  it("handles rapid clicks with onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderButton({ text: "Rapid Click", onClick: handleClick });

    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("can be disabled via native button attributes", () => {
    const { container } = renderButton({ text: "Test" });
    const button = container.querySelector("button");

    // Button should be enabled by default
    expect(button).not.toBeDisabled();
  });

  it("renders with long text content", () => {
    const longText =
      "This is a very long button text that might wrap to multiple lines in the UI";

    renderButton({ text: longText });

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it("onClick prop is optional", () => {
    // Should render without errors when onClick is not provided
    const { container } = renderButton({ text: "Optional Click" });

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
    expect(button.onclick).toBeTruthy(); // Will be empty string from component
  });
});
