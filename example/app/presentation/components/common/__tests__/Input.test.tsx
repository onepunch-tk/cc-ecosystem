import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Input from "../Input";

describe("Input", () => {
	afterEach(() => {
		cleanup();
	});

	describe("label 렌더링", () => {
		it("label prop 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			expect(screen.getByText("이름")).toBeInTheDocument();
		});
	});

	describe("input 요소 렌더링", () => {
		it("name 속성을 가진 input 요소를 렌더링한다", () => {
			// Arrange & Act
			render(<Input label="이름" name="username" />);

			// Assert
			expect(document.querySelector("input[name='username']")).toBeInTheDocument();
		});

		it("type prop을 지정하지 않으면 기본 type은 'text'이다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
		});

		it("type='email'로 지정하면 input의 type이 'email'이다", () => {
			// Arrange & Act
			render(<Input label="이메일" name="email" type="email" />);

			// Assert
			const input = document.querySelector("input[name='email']");
			expect(input).toHaveAttribute("type", "email");
		});
	});

	describe("required 표시", () => {
		it("required가 true이면 label에 '*' 표시가 나타난다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" required />);

			// Assert
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("required가 false이면 label에 '*' 표시가 없다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("error 메시지", () => {
		it("error prop이 제공되면 에러 메시지가 표시된다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" error="필수 항목입니다" />);

			// Assert
			expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
		});

		it("error prop이 제공되면 role='alert' 요소로 렌더링된다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" error="필수 항목입니다" />);

			// Assert
			expect(screen.getByRole("alert")).toBeInTheDocument();
		});

		it("error prop이 없으면 에러 메시지가 표시되지 않는다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		});
	});

	describe("disabled 상태", () => {
		it("disabled가 true이면 input이 비활성화된다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" disabled />);

			// Assert
			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("disabled가 false이면 input이 활성화 상태이다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});
	});

	describe("focus-visible 스타일", () => {
		it("input 요소에 focus-visible 관련 클래스가 존재한다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" />);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input.className).toMatch(/focus-visible/);
		});
	});

	describe("추가 HTML 속성 전달", () => {
		it("placeholder 속성이 input 요소에 전달된다", () => {
			// Arrange & Act
			render(<Input label="이름" name="name" placeholder="이름을 입력하세요" />);

			// Assert
			expect(screen.getByPlaceholderText("이름을 입력하세요")).toBeInTheDocument();
		});
	});
});
