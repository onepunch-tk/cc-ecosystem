import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Input from "~/presentation/components/common/Input";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Input", () => {
	it("label 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Input label="이름" />);

		// Assert
		expect(screen.getByText("이름")).toBeInTheDocument();
	});

	it("htmlFor/id를 통해 label과 input을 연결해야 한다", () => {
		// Arrange & Act
		render(<Input label="이메일" />);

		// Assert — getByLabelText는 label-input 연결이 정확할 때만 성공
		expect(screen.getByLabelText("이메일")).toBeInTheDocument();
	});

	it("error prop이 있을 때 에러 메시지를 표시해야 한다", () => {
		// Arrange & Act
		render(<Input label="이메일" error="올바른 이메일을 입력하세요" />);

		// Assert
		expect(screen.getByText("올바른 이메일을 입력하세요")).toBeInTheDocument();
	});

	it("error prop이 있을 때 input에 border-error 클래스를 적용해야 한다", () => {
		// Arrange & Act
		render(<Input label="이메일" error="에러 발생" />);

		// Assert
		expect(screen.getByLabelText("이메일")).toHaveClass("border-error");
	});

	it("onChange 핸들러를 전달해야 한다", () => {
		// Arrange
		const handleChange = vi.fn();
		render(<Input label="이름" onChange={handleChange} />);

		// Act
		fireEvent.change(screen.getByLabelText("이름"), { target: { value: "홍길동" } });

		// Assert
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("추가 input 속성(placeholder)을 전달해야 한다", () => {
		// Arrange & Act
		render(<Input label="이름" placeholder="이름을 입력하세요" />);

		// Assert
		expect(screen.getByLabelText("이름")).toHaveAttribute("placeholder", "이름을 입력하세요");
	});
});
