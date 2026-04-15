import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Textarea from "~/presentation/components/common/Textarea";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("Textarea", () => {
	it("label 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<Textarea label="문의 내용" />);

		// Assert
		expect(screen.getByText("문의 내용")).toBeInTheDocument();
	});

	it("htmlFor/id를 통해 label과 textarea를 연결해야 한다", () => {
		// Arrange & Act
		render(<Textarea label="문의 내용" />);

		// Assert — getByLabelText는 label-textarea 연결이 정확할 때만 성공
		expect(screen.getByLabelText("문의 내용")).toBeInTheDocument();
	});

	it("error prop이 있을 때 에러 메시지를 표시해야 한다", () => {
		// Arrange & Act
		render(<Textarea label="문의 내용" error="내용을 입력해주세요" />);

		// Assert
		expect(screen.getByText("내용을 입력해주세요")).toBeInTheDocument();
	});

	it("기본 rows 값이 4여야 한다", () => {
		// Arrange & Act
		render(<Textarea label="문의 내용" />);

		// Assert
		expect(screen.getByLabelText("문의 내용")).toHaveAttribute("rows", "4");
	});

	it("onChange 핸들러를 전달해야 한다", () => {
		// Arrange
		const handleChange = vi.fn();
		render(<Textarea label="문의 내용" onChange={handleChange} />);

		// Act
		fireEvent.change(screen.getByLabelText("문의 내용"), { target: { value: "테스트 내용" } });

		// Assert
		expect(handleChange).toHaveBeenCalledTimes(1);
	});
});
