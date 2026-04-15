import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import HeroSection from "../HeroSection";

// jsdom은 scrollIntoView를 구현하지 않으므로 mock 처리
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
	cleanup();
	// spyOn으로 교체된 구현체를 원복하기 위해 restoreAllMocks 사용
	vi.restoreAllMocks();
});

describe("HeroSection", () => {

	it("headline 텍스트('비즈니스의 디지털 전환, TechFlow와 함께')를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<HeroSection />);

		// Assert
		expect(
			screen.getByText("비즈니스의 디지털 전환, TechFlow와 함께"),
		).toBeInTheDocument();
	});

	it("subHeadline 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<HeroSection />);

		// Assert
		expect(
			screen.getByText(
				"IT 컨설팅 전문 기업 TechFlow는 기업의 디지털 혁신을 위한 최적의 솔루션을 제공합니다.",
			),
		).toBeInTheDocument();
	});

	it("CTA 버튼('문의하기')을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<HeroSection />);

		// Assert
		expect(
			screen.getByRole("button", { name: "문의하기" }),
		).toBeInTheDocument();
	});

	it("CTA 버튼 클릭 시 contact 섹션으로 스크롤해야 한다", async () => {
		// Arrange
		const mockScrollIntoView = vi.fn();
		const mockContactElement = { scrollIntoView: mockScrollIntoView };
		vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
			if (id === "contact") return mockContactElement as unknown as HTMLElement;
			return null;
		});

		render(<HeroSection />);
		const ctaButton = screen.getByRole("button", { name: "문의하기" });

		// Act
		fireEvent.click(ctaButton);

		// Assert
		expect(document.getElementById).toHaveBeenCalledWith("contact");
		expect(mockScrollIntoView).toHaveBeenCalled();
	});

	it("section에 id='hero'가 설정되어야 한다", () => {
		// Arrange & Act
		render(<HeroSection />);

		// Assert
		const section = document.getElementById("hero");
		expect(section).toBeInTheDocument();
	});
});
