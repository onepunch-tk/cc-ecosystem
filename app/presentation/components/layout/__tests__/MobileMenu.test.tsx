import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import MobileMenu from "~/presentation/components/layout/MobileMenu";

// use-scroll-to-section 모듈을 mock 처리
const mockScrollToSection = vi.fn();
vi.mock("~/presentation/hooks/use-scroll-to-section", () => ({
	scrollToSection: (id: string) => mockScrollToSection(id),
}));

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("MobileMenu", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// jsdom은 scrollIntoView를 구현하지 않으므로 mock 처리
		Element.prototype.scrollIntoView = vi.fn();
	});

	it("isOpen이 false일 때 렌더링하지 않아야 한다", () => {
		// Arrange & Act
		render(<MobileMenu isOpen={false} onClose={vi.fn()} />);

		// Assert
		expect(screen.queryByRole("button", { name: "소개" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "서비스" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "문의" })).not.toBeInTheDocument();
	});

	it("isOpen이 true일 때 네비게이션 링크를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<MobileMenu isOpen={true} onClose={vi.fn()} />);

		// Assert
		expect(screen.getByRole("button", { name: "소개" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "서비스" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "문의" })).toBeInTheDocument();
	});

	it("네비게이션 링크 클릭 시 onClose를 호출해야 한다", () => {
		// Arrange
		const handleClose = vi.fn();
		render(<MobileMenu isOpen={true} onClose={handleClose} />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "소개" }));

		// Assert
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it("Escape 키를 누르면 onClose를 호출해야 한다", () => {
		// Arrange
		const handleClose = vi.fn();
		render(<MobileMenu isOpen={true} onClose={handleClose} />);

		// Act
		fireEvent.keyDown(document, { key: "Escape" });

		// Assert
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
