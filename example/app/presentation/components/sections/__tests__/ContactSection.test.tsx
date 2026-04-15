import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ContactSection from "../ContactSection";

describe("ContactSection", () => {
	afterEach(() => {
		cleanup();
	});

	describe("섹션 구조", () => {
		it("id='contact' 섹션 요소가 렌더링된다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			expect(document.querySelector("section#contact")).toBeInTheDocument();
		});

		it("'Contact' 헤딩이 표시된다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			expect(screen.getByText(/Contact/i)).toBeInTheDocument();
		});
	});

	describe("폼 입력 필드", () => {
		it("이름 입력 필드가 존재한다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert — label 또는 placeholder로 탐색
			const nameInput =
				screen.queryByLabelText(/이름/i) ??
				screen.queryByPlaceholderText(/이름/i);
			expect(nameInput).toBeInTheDocument();
		});

		it("이메일 입력 필드가 존재한다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			const emailInput =
				screen.queryByLabelText(/이메일/i) ??
				screen.queryByPlaceholderText(/이메일/i);
			expect(emailInput).toBeInTheDocument();
		});

		it("회사명 입력 필드가 존재한다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			const companyInput =
				screen.queryByLabelText(/회사/i) ??
				screen.queryByPlaceholderText(/회사/i);
			expect(companyInput).toBeInTheDocument();
		});

		it("메시지 입력 필드가 존재한다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			const messageInput =
				screen.queryByLabelText(/메시지/i) ??
				screen.queryByPlaceholderText(/메시지/i);
			expect(messageInput).toBeInTheDocument();
		});
	});

	describe("제출 버튼", () => {
		it("제출 버튼이 존재한다", () => {
			// Arrange & Act
			render(<ContactSection />);

			// Assert
			const submitButton = screen.getByRole("button", { name: /제출|보내기|문의/i });
			expect(submitButton).toBeInTheDocument();
		});
	});
});
