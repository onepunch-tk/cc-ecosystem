import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ServicesSection from "../ServicesSection";

describe("ServicesSection", () => {
	afterEach(() => {
		cleanup();
	});

	describe("섹션 구조", () => {
		it("id='services' 섹션 요소가 렌더링된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(document.querySelector("section#services")).toBeInTheDocument();
		});

		it("'Our Services' 섹션 타이틀이 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("Our Services")).toBeInTheDocument();
		});
	});

	describe("서비스 카드 렌더링", () => {
		it("'디지털 트랜스포메이션' 서비스 카드가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("디지털 트랜스포메이션")).toBeInTheDocument();
		});

		it("'클라우드 솔루션' 서비스 카드가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("클라우드 솔루션")).toBeInTheDocument();
		});

		it("'데이터 분석' 서비스 카드가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("데이터 분석")).toBeInTheDocument();
		});

		it("'보안 컨설팅' 서비스 카드가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("보안 컨설팅")).toBeInTheDocument();
		});

		it("4개의 서비스 카드가 모두 렌더링된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(screen.getByText("디지털 트랜스포메이션")).toBeInTheDocument();
			expect(screen.getByText("클라우드 솔루션")).toBeInTheDocument();
			expect(screen.getByText("데이터 분석")).toBeInTheDocument();
			expect(screen.getByText("보안 컨설팅")).toBeInTheDocument();
		});
	});

	describe("서비스 설명 텍스트", () => {
		it("'디지털 트랜스포메이션' 카드에 설명 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(
				screen.getByText(
					"기존 비즈니스 프로세스를 디지털화하고 혁신적인 기술로 비즈니스 모델을 재설계합니다.",
				),
			).toBeInTheDocument();
		});

		it("'클라우드 솔루션' 카드에 설명 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(
				screen.getByText(
					"클라우드 인프라 설계, 마이그레이션, 최적화를 통해 비용 절감과 확장성을 실현합니다.",
				),
			).toBeInTheDocument();
		});

		it("'데이터 분석' 카드에 설명 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(
				screen.getByText(
					"빅데이터와 AI 기반 분석으로 데이터 주도 의사결정을 지원합니다.",
				),
			).toBeInTheDocument();
		});

		it("'보안 컨설팅' 카드에 설명 텍스트가 표시된다", () => {
			// Arrange & Act
			render(<ServicesSection />);

			// Assert
			expect(
				screen.getByText(
					"사이버 보안 위협으로부터 비즈니스를 보호하고 컴플라이언스를 확보합니다.",
				),
			).toBeInTheDocument();
		});
	});
});
