import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Card from "../Card";

describe("Card", () => {
	afterEach(() => {
		cleanup();
	});

	describe("기본 렌더링", () => {
		it("children 콘텐츠를 렌더링한다", () => {
			// Arrange & Act
			render(<Card><p>카드 내용</p></Card>);

			// Assert
			expect(screen.getByText("카드 내용")).toBeInTheDocument();
		});

		it("<div> 요소로 렌더링된다", () => {
			// Arrange & Act
			const { container } = render(<Card><p>내용</p></Card>);

			// Assert
			expect(container.firstChild?.nodeName).toBe("DIV");
		});
	});

	describe("기본 스타일 클래스", () => {
		it("rounded-xl 클래스를 갖는다", () => {
			// Arrange & Act
			const { container } = render(<Card><p>내용</p></Card>);

			// Assert
			expect(container.firstChild).toHaveClass("rounded-xl");
		});

		it("shadow-card 클래스를 갖는다", () => {
			// Arrange & Act
			const { container } = render(<Card><p>내용</p></Card>);

			// Assert
			expect(container.firstChild).toHaveClass("shadow-card");
		});

		it("hover:shadow-card-hover 클래스를 갖는다", () => {
			// Arrange & Act
			const { container } = render(<Card><p>내용</p></Card>);

			// Assert
			expect(container.firstChild).toHaveClass("hover:shadow-card-hover");
		});

		it("호버 애니메이션을 위한 motion-safe:hover:-translate-y-0.5 클래스를 갖는다", () => {
			// Arrange & Act
			const { container } = render(<Card><p>내용</p></Card>);

			// Assert
			expect(container.firstChild).toHaveClass("motion-safe:hover:-translate-y-0.5");
		});
	});

	describe("className prop", () => {
		it("추가 className이 제공되면 기존 클래스와 병합한다", () => {
			// Arrange & Act
			const { container } = render(<Card className="p-8 bg-white"><p>내용</p></Card>);

			// Assert
			expect(container.firstChild).toHaveClass("rounded-xl");
			expect(container.firstChild).toHaveClass("p-8");
			expect(container.firstChild).toHaveClass("bg-white");
		});
	});
});
