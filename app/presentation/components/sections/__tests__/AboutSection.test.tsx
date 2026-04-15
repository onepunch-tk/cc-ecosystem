import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AboutSection from "../AboutSection";

afterEach(() => {
	cleanup();
});

describe("AboutSection", () => {
	it("섹션 heading('TechFlow를 소개합니다')을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<AboutSection />);

		// Assert
		expect(screen.getByText("TechFlow를 소개합니다")).toBeInTheDocument();
	});

	it("vision 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<AboutSection />);

		// Assert
		expect(
			screen.getByText("기술로 비즈니스의 미래를 설계합니다."),
		).toBeInTheDocument();
	});

	it("mission 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<AboutSection />);

		// Assert
		expect(
			screen.getByText(
				"고객의 비즈니스 성장을 위한 맞춤형 IT 솔루션을 제공하며, 디지털 전환의 모든 과정을 함께합니다.",
			),
		).toBeInTheDocument();
	});

	it("3개의 core value 카드를 렌더링해야 한다 (혁신, 신뢰, 전문성)", () => {
		// Arrange & Act
		render(<AboutSection />);

		// Assert
		expect(screen.getByText("혁신")).toBeInTheDocument();
		expect(screen.getByText("신뢰")).toBeInTheDocument();
		expect(screen.getByText("전문성")).toBeInTheDocument();
	});

	it("section에 id='about'이 설정되어야 한다", () => {
		// Arrange & Act
		render(<AboutSection />);

		// Assert
		const section = document.getElementById("about");
		expect(section).toBeInTheDocument();
	});
});
