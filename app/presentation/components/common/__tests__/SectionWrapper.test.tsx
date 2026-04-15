import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SectionWrapper from "~/presentation/components/common/SectionWrapper";

// Vitest는 자동 cleanup을 지원하지 않으므로 각 테스트 후 DOM 초기화
afterEach(() => {
	cleanup();
});

describe("SectionWrapper", () => {
	it("section 엘리먼트 안에 children을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<SectionWrapper id="hero">섹션 내용</SectionWrapper>);

		// Assert
		const section = screen.getByRole("region");
		expect(section.tagName.toLowerCase()).toBe("section");
		expect(screen.getByText("섹션 내용")).toBeInTheDocument();
	});

	it("section에 id 속성을 설정해야 한다", () => {
		// Arrange & Act
		render(<SectionWrapper id="about">내용</SectionWrapper>);

		// Assert
		expect(screen.getByRole("region")).toHaveAttribute("id", "about");
	});

	it("기본적으로 light 변형 클래스(bg-background)를 적용해야 한다", () => {
		// Arrange & Act
		render(<SectionWrapper id="hero">내용</SectionWrapper>);

		// Assert
		expect(screen.getByRole("region")).toHaveClass("bg-background");
	});

	it("variant='surface'일 때 surface 변형 클래스(bg-surface)를 적용해야 한다", () => {
		// Arrange & Act
		render(<SectionWrapper id="services" variant="surface">내용</SectionWrapper>);

		// Assert
		expect(screen.getByRole("region")).toHaveClass("bg-surface");
	});

	it("커스텀 className을 병합해야 한다", () => {
		// Arrange
		const customClass = "py-20";

		// Act
		render(<SectionWrapper id="contact" className={customClass}>내용</SectionWrapper>);

		// Assert
		expect(screen.getByRole("region")).toHaveClass(customClass);
	});
});
