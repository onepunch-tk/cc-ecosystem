import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Textarea from "../Textarea";

describe("Textarea", () => {
	afterEach(() => {
		cleanup();
	});

	describe("label 렌더링", () => {
		it("label prop 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" />);

			// Assert
			expect(screen.getByText("메시지")).toBeInTheDocument();
		});
	});

	describe("textarea 요소 렌더링", () => {
		it("name 속성을 가진 textarea 요소를 렌더링한다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" />);

			// Assert
			expect(document.querySelector("textarea[name='message']")).toBeInTheDocument();
		});

		it("rows prop을 지정하지 않으면 기본 rows 값이 설정된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" />);

			// Assert
			const textarea = screen.getByRole("textbox");
			const rows = Number(textarea.getAttribute("rows"));
			expect(rows).toBeGreaterThan(0);
		});

		it("rows prop을 지정하면 해당 rows 값이 textarea에 적용된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" rows={6} />);

			// Assert
			expect(screen.getByRole("textbox")).toHaveAttribute("rows", "6");
		});
	});

	describe("required 표시", () => {
		it("required가 true이면 label에 '*' 표시가 나타난다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" required />);

			// Assert
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("required가 false이면 label에 '*' 표시가 없다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" />);

			// Assert
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("error 메시지", () => {
		it("error prop이 제공되면 에러 메시지가 표시된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" error="필수 항목입니다" />);

			// Assert
			expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
		});

		it("error prop이 제공되면 role='alert' 요소로 렌더링된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" error="필수 항목입니다" />);

			// Assert
			expect(screen.getByRole("alert")).toBeInTheDocument();
		});

		it("error prop이 없으면 에러 메시지가 표시되지 않는다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" />);

			// Assert
			expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		});
	});

	describe("추가 HTML 속성 전달", () => {
		it("placeholder 속성이 textarea 요소에 전달된다", () => {
			// Arrange & Act
			render(<Textarea label="메시지" name="message" placeholder="메시지를 입력하세요" />);

			// Assert
			expect(screen.getByPlaceholderText("메시지를 입력하세요")).toBeInTheDocument();
		});
	});
});
