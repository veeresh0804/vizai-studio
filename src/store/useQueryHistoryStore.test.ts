import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQueryHistoryStore } from "@/store/useQueryHistoryStore";

// Reset store state before each test so tests are isolated
beforeEach(() => {
  useQueryHistoryStore.getState().clearHistory();
});

describe("useQueryHistoryStore – initial state", () => {
  it("starts with an empty history", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    expect(result.current.history).toEqual([]);
  });
});

describe("useQueryHistoryStore – addQuery", () => {
  it("adds a query to history", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => result.current.addQuery("solar system"));
    expect(result.current.history).toContain("solar system");
  });

  it("places the most recent query at the front", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      result.current.addQuery("first");
      result.current.addQuery("second");
    });
    expect(result.current.history[0]).toBe("second");
    expect(result.current.history[1]).toBe("first");
  });

  it("deduplicates: moves an existing query to the front instead of adding a duplicate", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      result.current.addQuery("solar system");
      result.current.addQuery("black hole");
      result.current.addQuery("solar system"); // duplicate
    });
    expect(result.current.history[0]).toBe("solar system");
    expect(result.current.history).toHaveLength(2);
  });

  it("does not store the same query twice", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      result.current.addQuery("atom");
      result.current.addQuery("atom");
    });
    expect(result.current.history.filter((h) => h === "atom")).toHaveLength(1);
  });

  it("enforces a maximum history length of 10", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      for (let i = 1; i <= 12; i++) {
        result.current.addQuery(`query ${i}`);
      }
    });
    expect(result.current.history).toHaveLength(10);
  });

  it("drops the oldest entry when the limit is exceeded", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      for (let i = 1; i <= 11; i++) {
        result.current.addQuery(`query ${i}`);
      }
    });
    // "query 1" was the oldest and should have been dropped
    expect(result.current.history).not.toContain("query 1");
    expect(result.current.history).toContain("query 11");
  });
});

describe("useQueryHistoryStore – clearHistory", () => {
  it("empties the history", () => {
    const { result } = renderHook(() => useQueryHistoryStore());
    act(() => {
      result.current.addQuery("solar system");
      result.current.addQuery("black hole");
    });
    act(() => result.current.clearHistory());
    expect(result.current.history).toEqual([]);
  });
});
