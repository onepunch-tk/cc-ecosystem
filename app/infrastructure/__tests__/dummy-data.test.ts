import { describe, it, expect } from "vitest";
import {
	getHeroData,
	getAboutData,
	getServicesData,
	getNavItems,
	getFooterLinks,
} from "~/infrastructure/dummy-data";

describe("dummy-data", () => {
	describe("getHeroData()", () => {
		it("headline, subHeadline, ctaText, ctaTargetId 속성을 가진 객체를 반환해야 한다", () => {
			// Act
			const result = getHeroData();

			// Assert
			expect(result).toHaveProperty("headline");
			expect(result).toHaveProperty("subHeadline");
			expect(result).toHaveProperty("ctaText");
			expect(result).toHaveProperty("ctaTargetId");
		});
	});

	describe("getAboutData()", () => {
		it("길이 3인 coreValues 배열을 가진 객체를 반환해야 한다", () => {
			// Act
			const result = getAboutData();

			// Assert
			expect(result).toHaveProperty("coreValues");
			expect(Array.isArray(result.coreValues)).toBe(true);
			expect(result.coreValues).toHaveLength(3);
		});
	});

	describe("getServicesData()", () => {
		it("길이 4인 services 배열을 가진 객체를 반환해야 한다", () => {
			// Act
			const result = getServicesData();

			// Assert
			expect(result).toHaveProperty("services");
			expect(Array.isArray(result.services)).toBe(true);
			expect(result.services).toHaveLength(4);
		});
	});

	describe("getNavItems()", () => {
		it("label과 targetId 속성을 가진 항목들의 배열을 반환해야 한다", () => {
			// Act
			const result = getNavItems();

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			for (const item of result) {
				expect(item).toHaveProperty("label");
				expect(item).toHaveProperty("targetId");
			}
		});
	});

	describe("getFooterLinks()", () => {
		it("label과 href 속성을 가진 항목들의 비어있지 않은 배열을 반환해야 한다", () => {
			// Act
			const result = getFooterLinks();

			// Assert
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			for (const item of result) {
				expect(item).toHaveProperty("label");
				expect(item).toHaveProperty("href");
			}
		});
	});
});
