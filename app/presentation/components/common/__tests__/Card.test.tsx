import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Card from "~/presentation/components/common/Card";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Card", () => {
	it("children 콘텐츠를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Card>카드 내용</Card>);

		// Assert
		expect(screen.getByText("카드 내용")).toBeInTheDocument();
	});

	it("커스텀 className을 기본 클래스와 병합해야 한다", () => {
		// Arrange
		const customClass = "my-custom-class";

		// Act
		render(<Card className={customClass}>내용</Card>);

		// Assert
		const card = screen.getByText("내용").closest("div") ?? screen.getByText("내용").parentElement;
		expect(card).toHaveClass(customClass);
	});
});
