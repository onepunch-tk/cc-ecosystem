import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { scrollToSection } from "~/presentation/hooks/use-scroll-to-section";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("scrollToSection", () => {
	beforeEach(() => {
		// jsdom은 scrollIntoView를 구현하지 않으므로 mock 처리
		Element.prototype.scrollIntoView = vi.fn();
	});

	it("대상 엘리먼트가 존재할 때 scrollIntoView({ behavior: 'smooth', block: 'start' })를 호출해야 한다", () => {
		// Arrange
		const targetId = "target-section";
		const targetElement = document.createElement("div");
		targetElement.id = targetId;
		document.body.appendChild(targetElement);

		// Act
		scrollToSection(targetId);

		// Assert
		expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "start",
		});

		// Cleanup
		document.body.removeChild(targetElement);
	});

	it("대상 엘리먼트가 존재하지 않을 때 에러가 발생하지 않아야 한다", () => {
		// Arrange
		const nonExistentId = "non-existent-section";

		// Act & Assert
		expect(() => scrollToSection(nonExistentId)).not.toThrow();
	});
});
