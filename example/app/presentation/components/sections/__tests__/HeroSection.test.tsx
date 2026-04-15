import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
	afterEach(() => {
		cleanup();
	});

	describe("슬로건 텍스트 렌더링", () => {
		it("'디지털 혁신을 이끄는 파트너' 슬로건 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<HeroSection />);

			// Assert
			expect(
				screen.getByText("디지털 혁신을 이끄는 파트너"),
			).toBeInTheDocument();
		});
	});

	describe("CTA 버튼", () => {
		it("'문의하기' 버튼이 존재한다", () => {
			// Arrange & Act
			render(<HeroSection />);

			// Assert
			expect(
				screen.getByRole("button", { name: "문의하기" }),
			).toBeInTheDocument();
		});

		it("'문의하기' 버튼 클릭 시 id='contact' 요소의 scrollIntoView가 호출된다", () => {
			// Arrange
			const contactEl = document.createElement("div");
			contactEl.id = "contact";
			const scrollIntoViewMock = vi.fn();
			contactEl.scrollIntoView = scrollIntoViewMock;
			document.body.appendChild(contactEl);

			render(<HeroSection />);

			// Act
			fireEvent.click(screen.getByRole("button", { name: "문의하기" }));

			// Assert
			expect(scrollIntoViewMock).toHaveBeenCalledOnce();

			// Cleanup
			document.body.removeChild(contactEl);
		});
	});
});
