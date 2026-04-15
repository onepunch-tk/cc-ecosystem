import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Button from "~/presentation/components/common/Button";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Button", () => {
	it("children 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Button>클릭하기</Button>);

		// Assert
		expect(screen.getByRole("button", { name: "클릭하기" })).toBeInTheDocument();
	});

	it("기본적으로 solid 변형 클래스(bg-primary)를 적용해야 한다", () => {
		// Arrange & Act
		render(<Button>버튼</Button>);

		// Assert
		expect(screen.getByRole("button")).toHaveClass("bg-primary");
	});

	it("variant='ghost'일 때 ghost 변형 클래스(border)를 적용해야 한다", () => {
		// Arrange & Act
		render(<Button variant="ghost">버튼</Button>);

		// Assert
		expect(screen.getByRole("button")).toHaveClass("border");
	});

	it("onClick 핸들러를 전달해야 한다", () => {
		// Arrange
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>클릭</Button>);

		// Act
		fireEvent.click(screen.getByRole("button"));

		// Assert
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("disabled prop이 true일 때 비활성화 상태로 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Button disabled>버튼</Button>);

		// Assert
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("추가 HTML 속성(type='submit')을 전달해야 한다", () => {
		// Arrange & Act
		render(<Button type="submit">제출</Button>);

		// Assert
		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});
});
