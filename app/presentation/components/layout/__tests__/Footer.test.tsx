import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Footer from "~/presentation/components/layout/Footer";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Footer", () => {
	it('"TechFlow" 텍스트가 포함된 저작권 정보를 렌더링해야 한다', () => {
		// Arrange & Act
		render(<Footer />);

		// Assert
		expect(screen.getByText(/TechFlow/)).toBeInTheDocument();
	});

	it("푸터 링크(개인정보처리방침, 이용약관)를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Footer />);

		// Assert
		expect(screen.getByRole("link", { name: "개인정보처리방침" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "이용약관" })).toBeInTheDocument();
	});
});
