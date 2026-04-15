import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutSection from "../AboutSection";

describe("AboutSection", () => {
	afterEach(() => {
		cleanup();
	});

	describe("비전/미션 텍스트 렌더링", () => {
		it("'비전' 또는 '미션' 관련 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<AboutSection />);

			// Assert — '비전' 또는 '미션' 중 하나 이상이 문서에 존재해야 함
			const visionEl = screen.queryByText(/비전/);
			const missionEl = screen.queryByText(/미션/);

			expect(visionEl || missionEl).toBeTruthy();
		});
	});

	describe("핵심가치 카드 렌더링", () => {
		it("'혁신' 핵심가치 카드가 표시된다", () => {
			// Arrange & Act
			render(<AboutSection />);

			// Assert
			expect(screen.getByText("혁신")).toBeInTheDocument();
		});

		it("'신뢰' 핵심가치 카드가 표시된다", () => {
			// Arrange & Act
			render(<AboutSection />);

			// Assert
			expect(screen.getByText("신뢰")).toBeInTheDocument();
		});

		it("'성장' 핵심가치 카드가 표시된다", () => {
			// Arrange & Act
			render(<AboutSection />);

			// Assert
			expect(screen.getByText("성장")).toBeInTheDocument();
		});

		it("3개의 핵심가치 카드가 모두 렌더링된다", () => {
			// Arrange & Act
			render(<AboutSection />);

			// Assert — 3개 핵심가치가 모두 존재
			expect(screen.getByText("혁신")).toBeInTheDocument();
			expect(screen.getByText("신뢰")).toBeInTheDocument();
			expect(screen.getByText("성장")).toBeInTheDocument();
		});
	});
});
