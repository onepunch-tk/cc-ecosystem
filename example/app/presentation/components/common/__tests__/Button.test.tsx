import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Button from "../Button";

describe("Button", () => {
	afterEach(() => {
		cleanup();
	});

	describe("기본 렌더링", () => {
		it("<button> 요소와 children 텍스트를 렌더링한다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
		});

		it("기본 type은 'button'이다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveAttribute("type", "button");
		});

		it("type prop이 'submit'이면 type='submit'을 적용한다", () => {
			// Arrange & Act
			render(<Button type="submit">제출</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});
	});

	describe("onClick 핸들러", () => {
		it("클릭 시 onClick 핸들러를 호출한다", () => {
			// Arrange
			const handleClick = vi.fn();
			render(<Button onClick={handleClick}>클릭</Button>);

			// Act
			fireEvent.click(screen.getByRole("button"));

			// Assert
			expect(handleClick).toHaveBeenCalledOnce();
		});

		it("disabled 상태에서 클릭 시 onClick을 호출하지 않는다", () => {
			// Arrange
			const handleClick = vi.fn();
			render(<Button onClick={handleClick} disabled>클릭</Button>);

			// Act
			fireEvent.click(screen.getByRole("button"));

			// Assert
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("disabled 상태", () => {
		it("disabled prop이 있으면 disabled 속성과 opacity-50, cursor-not-allowed 클래스를 적용한다", () => {
			// Arrange & Act
			render(<Button disabled>비활성</Button>);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toBeDisabled();
			expect(button).toHaveClass("opacity-50");
			expect(button).toHaveClass("cursor-not-allowed");
		});
	});

	describe("접근성", () => {
		it("터치 타겟을 위한 min-h-11 클래스를 갖는다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("min-h-11");
		});

		it("포커스 표시를 위한 focus-visible:ring-2 클래스를 갖는다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-2");
		});
	});

	describe("variant prop", () => {
		it("기본 variant는 'primary'이며 bg-primary 클래스를 갖는다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("bg-primary");
		});

		it("variant='secondary'이면 bg-surface 클래스를 적용한다", () => {
			// Arrange & Act
			render(<Button variant="secondary">클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("bg-surface");
		});

		it("variant='outline'이면 border 클래스를 적용한다", () => {
			// Arrange & Act
			render(<Button variant="outline">클릭</Button>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("border");
		});
	});

	describe("size prop", () => {
		it("기본 size는 'md'이며 px-6 py-2.5 클래스를 갖는다", () => {
			// Arrange & Act
			render(<Button>클릭</Button>);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toHaveClass("px-6");
			expect(button).toHaveClass("py-2.5");
		});

		it("size='sm'이면 px-4 py-2 클래스를 적용한다", () => {
			// Arrange & Act
			render(<Button size="sm">클릭</Button>);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toHaveClass("px-4");
			expect(button).toHaveClass("py-2");
		});

		it("size='lg'이면 px-8 py-3 클래스를 적용한다", () => {
			// Arrange & Act
			render(<Button size="lg">클릭</Button>);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toHaveClass("px-8");
			expect(button).toHaveClass("py-3");
		});
	});
});
