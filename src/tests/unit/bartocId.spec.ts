import { describe, expect, it } from "vitest";
import { extractBartocId } from "../../server/utils/utils";

describe("extractBartocId", () => {
  it("extracts the numeric id from a BARTOC node URI", () => {
    expect(extractBartocId("http://bartoc.org/en/node/20541")).toBe("20541");
  });

  it("accepts https and a trailing slash", () => {
    expect(extractBartocId("https://bartoc.org/en/node/20541/")).toBe("20541");
  });

  it("ignores non BARTOC node URIs", () => {
    expect(extractBartocId("https://example.org/en/node/20541")).toBeUndefined();
  });
});
