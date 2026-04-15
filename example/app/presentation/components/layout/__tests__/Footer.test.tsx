import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
	afterEach(() => {
		cleanup();
	});

	describe("회사명 렌더링", () => {
		it("회사명 'TechFlow'를 렌더링한다", () => {
			// Arrange & Act
			render(<Footer />);

			// Assert
			expect(screen.getByText("TechFlow")).toBeInTheDocument();
		});
	});

	describe("저작권 텍스트", () => {
		it("현재 연도가 포함된 저작권 텍스트를 렌더링한다", () => {
			// Arrange
			const currentYear = new Date().getFullYear();

			// Act
			render(<Footer />);

			// Assert
			expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
		});

		it("저작권 기호(©)가 포함된 텍스트를 렌더링한다", () => {
			// Arrange & Act
			render(<Footer />);

			// Assert
			expect(screen.getByText(/©/)).toBeInTheDocument();
		});
	});

	describe("푸터 요소", () => {
		it("<footer> 요소를 렌더링한다", () => {
			// Arrange & Act
			render(<Footer />);

			// Assert
			expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		});
	});
});
