import { describe, expect, it } from "vitest";
import { aboutData, heroData, servicesData } from "../dummy-data";

describe("dummy-data", () => {
	describe("heroData", () => {
		it("title 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { title } = heroData;

			// Assert
			expect(typeof title).toBe("string");
			expect(title.length).toBeGreaterThan(0);
		});

		it("subtitle 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { subtitle } = heroData;

			// Assert
			expect(typeof subtitle).toBe("string");
			expect(subtitle.length).toBeGreaterThan(0);
		});

		it("ctaText 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { ctaText } = heroData;

			// Assert
			expect(typeof ctaText).toBe("string");
			expect(ctaText.length).toBeGreaterThan(0);
		});

		it("ctaLink 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { ctaLink } = heroData;

			// Assert
			expect(typeof ctaLink).toBe("string");
			expect(ctaLink.length).toBeGreaterThan(0);
		});
	});

	describe("aboutData", () => {
		it("title 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { title } = aboutData;

			// Assert
			expect(typeof title).toBe("string");
			expect(title.length).toBeGreaterThan(0);
		});

		it("description 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { description } = aboutData;

			// Assert
			expect(typeof description).toBe("string");
			expect(description.length).toBeGreaterThan(0);
		});

		it("coreValues가 배열이다", () => {
			// Arrange & Act
			const { coreValues } = aboutData;

			// Assert
			expect(Array.isArray(coreValues)).toBe(true);
		});

		it("coreValues의 각 항목은 id, title, description, icon 속성을 가진다", () => {
			// Arrange & Act
			const { coreValues } = aboutData;

			// Assert
			for (const item of coreValues) {
				expect(typeof item.id).toBe("string");
				expect(typeof item.title).toBe("string");
				expect(item.title.length).toBeGreaterThan(0);
				expect(typeof item.description).toBe("string");
				expect(item.description.length).toBeGreaterThan(0);
				expect(item.icon).toBeDefined();
			}
		});
	});

	describe("servicesData", () => {
		it("title 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { title } = servicesData;

			// Assert
			expect(typeof title).toBe("string");
			expect(title.length).toBeGreaterThan(0);
		});

		it("subtitle 속성이 비어있지 않은 문자열이다", () => {
			// Arrange & Act
			const { subtitle } = servicesData;

			// Assert
			expect(typeof subtitle).toBe("string");
			expect(subtitle.length).toBeGreaterThan(0);
		});

		it("services가 배열이다", () => {
			// Arrange & Act
			const { services } = servicesData;

			// Assert
			expect(Array.isArray(services)).toBe(true);
		});

		it("services 배열에 정확히 4개의 항목이 있다", () => {
			// Arrange & Act
			const { services } = servicesData;

			// Assert
			expect(services).toHaveLength(4);
		});

		it("services의 각 항목은 id, title, description, icon 속성을 가진다", () => {
			// Arrange & Act
			const { services } = servicesData;

			// Assert
			for (const item of services) {
				expect(typeof item.id).toBe("string");
				expect(typeof item.title).toBe("string");
				expect(item.title.length).toBeGreaterThan(0);
				expect(typeof item.description).toBe("string");
				expect(item.description.length).toBeGreaterThan(0);
				expect(item.icon).toBeDefined();
			}
		});
	});
});
