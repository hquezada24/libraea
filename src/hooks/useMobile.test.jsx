// useMobile.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useMobile from "./useMobile";

describe("useMobile hook", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset window size before each test
    window.innerWidth = 1024;
  });

  afterEach(() => {
    // Restore original window size
    window.innerWidth = originalInnerWidth;
  });

  it("returns false when window width is above default breakpoint", () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(false);
  });

  it("returns true when window width is below default breakpoint", () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(true);
  });

  it("uses default breakpoint of 768px", () => {
    window.innerWidth = 767;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(true);
  });

  it("returns false when window width equals breakpoint", () => {
    window.innerWidth = 768;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(false);
  });

  it("accepts custom breakpoint", () => {
    window.innerWidth = 1000;

    const { result } = renderHook(() => useMobile(1200));

    expect(result.current).toBe(true);
  });

  it("returns false when above custom breakpoint", () => {
    window.innerWidth = 1300;

    const { result } = renderHook(() => useMobile(1200));

    expect(result.current).toBe(false);
  });

  it("updates when window is resized", async () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(false);

    // Simulate window resize
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("updates from mobile to desktop on resize", async () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(true);

    // Simulate window resize to desktop
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useMobile());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it("adds event listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useMobile());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it("re-evaluates when breakpoint changes", async () => {
    window.innerWidth = 900;

    const { result, rerender } = renderHook(
      ({ breakpoint }) => useMobile(breakpoint),
      { initialProps: { breakpoint: 768 } }
    );

    // With breakpoint 768, width 900 should be false
    expect(result.current).toBe(false);

    // Change breakpoint to 1024
    rerender({ breakpoint: 1024 });

    await waitFor(() => {
      // With breakpoint 1024, width 900 should be true
      expect(result.current).toBe(true);
    });
  });

  it("handles multiple rapid resizes", async () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(false);

    // Simulate multiple rapid resizes
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("works with very small breakpoints", () => {
    window.innerWidth = 300;

    const { result } = renderHook(() => useMobile(320));

    expect(result.current).toBe(true);
  });

  it("works with very large breakpoints", () => {
    window.innerWidth = 2000;

    const { result } = renderHook(() => useMobile(1920));

    expect(result.current).toBe(false);
  });

  it("handles edge case at exact breakpoint value", () => {
    const breakpoint = 768;
    window.innerWidth = breakpoint;

    const { result } = renderHook(() => useMobile(breakpoint));

    // Should be false because condition is < breakpoint, not <=
    expect(result.current).toBe(false);
  });

  it("handles edge case one pixel below breakpoint", () => {
    const breakpoint = 768;
    window.innerWidth = breakpoint - 1;

    const { result } = renderHook(() => useMobile(breakpoint));

    expect(result.current).toBe(true);
  });

  it("returns boolean value", () => {
    const { result } = renderHook(() => useMobile());

    expect(typeof result.current).toBe("boolean");
  });
});
