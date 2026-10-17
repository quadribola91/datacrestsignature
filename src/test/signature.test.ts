import { describe, expect, it } from "vitest";
import {
  DEFAULT_SIGNATURE,
  FIXED_COMPANY_DETAILS,
  SPACING_PRESETS,
  isDatacrestEmail,
  signatureHtml,
  validateSignatureDetails,
} from "@/lib/signature";

describe("Datacrest signature rules", () => {
  it("accepts only email addresses at datacrestgroup.com", () => {
    expect(isDatacrestEmail("person@datacrestgroup.com")).toBe(true);
    expect(isDatacrestEmail("person@other.com")).toBe(false);
    expect(isDatacrestEmail("person@datacrestgroup.com.example.org")).toBe(false);
  });

  it("requires a name, title, and Datacrest email before export", () => {
    expect(validateSignatureDetails(DEFAULT_SIGNATURE)).toBe("Enter your full name to continue.");
    expect(validateSignatureDetails({ ...DEFAULT_SIGNATURE, name: "Sam Example" })).toBe("Enter your job title to continue.");
    expect(validateSignatureDetails({ ...DEFAULT_SIGNATURE, name: "Sam Example", title: "Analyst", email: "sam@example.com" })).toContain("@datacrestgroup.com");
    expect(validateSignatureDetails({ ...DEFAULT_SIGNATURE, name: "Sam Example", title: "Analyst", email: "sam@datacrestgroup.com" })).toBe("");
  });

  it("starts blank for personal details while keeping company details fixed", () => {
    expect(DEFAULT_SIGNATURE.name).toBe("");
    expect(DEFAULT_SIGNATURE.title).toBe("");
    expect(DEFAULT_SIGNATURE.email).toBe("");
    expect(FIXED_COMPANY_DETAILS.website).toBe("www.datacrestgroup.com");
    expect(FIXED_COMPANY_DETAILS.address).toBe("281A Ajose Adeogun Street | Victoria Island | Lagos | Nigeria");
  });

  it("offers compact, balanced, and relaxed spacing in the email signature", () => {
    expect(SPACING_PRESETS).toEqual(["compact", "balanced", "relaxed"]);
    const compact = signatureHtml(DEFAULT_SIGNATURE, "https://example.com/banner.png", "compact");
    const relaxed = signatureHtml(DEFAULT_SIGNATURE, "https://example.com/banner.png", "relaxed");
    expect(compact).toContain("padding:0 8px 2px 8px");
    expect(relaxed).toContain("padding:0 8px 8px 8px");
  });
});