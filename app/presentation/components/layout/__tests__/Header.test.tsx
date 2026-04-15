import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Header from "~/presentation/components/layout/Header";

// use-scroll-to-section 모듈을 mock 처리
const mockScrollToSection = vi.fn();
vi.mock("~/presentation/hooks/scroll-to-section", () => ({
	scrollToSection: (id: string) => mockScrollToSection(id),
}));

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Header", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// jsdom은 scrollIntoView를 구현하지 않으므로 mock 처리
		Element.prototype.scrollIntoView = vi.fn();
	});

	it("TechFlow 로고 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Header />);

		// Assert
		expect(screen.getByText("TechFlow")).toBeInTheDocument();
	});

	it("네비게이션 링크(소개, 서비스, 문의)를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Header />);

		// Assert
		expect(screen.getByRole("button", { name: "소개" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "서비스" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "문의" })).toBeInTheDocument();
	});

	it("네비게이션 링크 클릭 시 해당 섹션으로 스크롤해야 한다", () => {
		// Arrange
		render(<Header />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "소개" }));

		// Assert
		expect(mockScrollToSection).toHaveBeenCalledWith("about");
	});

	it("모바일 메뉴 토글 버튼을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Header />);

		// Assert
		expect(
			screen.getByRole("button", { name: "메뉴 열기" }),
		).toBeInTheDocument();
	});
});
