import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ServicesSection from "../ServicesSection";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("ServicesSection", () => {
	it("section에 id='services'가 설정되어야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		const section = document.getElementById("services");
		expect(section).toBeInTheDocument();
	});

	it("heading('전문 서비스')을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		expect(screen.getByText("전문 서비스")).toBeInTheDocument();
	});

	it("tagline('Services')을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		expect(screen.getByText("Services")).toBeInTheDocument();
	});

	it("4개의 서비스 카드 타이틀을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		expect(screen.getByText("IT 컨설팅")).toBeInTheDocument();
		expect(screen.getByText("클라우드 솔루션")).toBeInTheDocument();
		expect(screen.getByText("보안 솔루션")).toBeInTheDocument();
		expect(screen.getByText("데이터 분석")).toBeInTheDocument();
	});

	it("각 서비스 카드의 description 텍스트를 렌더링해야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		expect(
			screen.getByText("기업 환경에 최적화된 IT 전략 수립 및 실행 계획을 제공합니다."),
		).toBeInTheDocument();
		expect(
			screen.getByText("AWS, Azure, GCP 기반 클라우드 마이그레이션 및 운영을 지원합니다."),
		).toBeInTheDocument();
		expect(
			screen.getByText("기업 데이터와 시스템을 보호하는 통합 보안 솔루션을 구축합니다."),
		).toBeInTheDocument();
		expect(
			screen.getByText("빅데이터 분석과 AI 기반 인사이트로 비즈니스 의사결정을 지원합니다."),
		).toBeInTheDocument();
	});

	it("'전체 서비스 보기' 버튼을 렌더링해야 한다", () => {
		// Arrange & Act
		render(<ServicesSection />);

		// Assert
		expect(
			screen.getByRole("button", { name: "전체 서비스 보기" }),
		).toBeInTheDocument();
	});
});
