import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Header from "../Header";

describe("Header", () => {
	afterEach(() => {
		cleanup();
	});

	describe("회사명 렌더링", () => {
		it("회사명 'TechFlow'를 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByText("TechFlow")).toBeInTheDocument();
		});
	});

	describe("네비게이션 링크", () => {
		it("'About' 링크를 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
		});

		it("'Services' 링크를 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
		});

		it("'Contact' 링크를 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
		});

		it("'About' 링크의 href가 '#about'이다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
		});

		it("'Services' 링크의 href가 '#services'이다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "#services");
		});

		it("'Contact' 링크의 href가 '#contact'이다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
		});
	});

	describe("햄버거 메뉴 버튼", () => {
		it("모바일용 햄버거 메뉴 버튼을 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
		});

		it("햄버거 메뉴 버튼에 aria-label이 있다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			const menuButton = screen.getByRole("button", { name: /menu/i });
			expect(menuButton).toHaveAttribute("aria-label");
		});
	});

	describe("헤더 요소", () => {
		it("<header> 요소를 렌더링한다", () => {
			// Arrange & Act
			render(<Header />);

			// Assert
			expect(screen.getByRole("banner")).toBeInTheDocument();
		});
	});
});
