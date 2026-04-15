import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SectionWrapper from "../SectionWrapper";

describe("SectionWrapper", () => {
	afterEach(() => {
		cleanup();
	});

	describe("section 요소 렌더링", () => {
		it("주어진 id 속성을 가진 <section> 요소를 렌더링한다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트 섹션">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(document.querySelector("section#test-section")).toBeInTheDocument();
		});

		it("ariaLabel prop과 일치하는 aria-label을 렌더링한다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="서비스 소개">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.getByRole("region", { name: "서비스 소개" })).toBeInTheDocument();
		});

		it("section 내부에 children 콘텐츠를 렌더링한다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트">
					<p>자식 콘텐츠</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.getByText("자식 콘텐츠")).toBeInTheDocument();
		});
	});

	describe("title prop", () => {
		it("title prop이 제공되면 <h2>로 렌더링한다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트" title="섹션 제목">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.getByRole("heading", { level: 2, name: "섹션 제목" })).toBeInTheDocument();
		});

		it("title prop이 생략되면 <h2>를 렌더링하지 않는다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
		});
	});

	describe("subtitle prop", () => {
		it("subtitle prop이 제공되면 <p>로 렌더링한다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트" subtitle="부제목 텍스트">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.getByText("부제목 텍스트")).toBeInTheDocument();
		});

		it("subtitle prop이 생략되면 부제목 <p>를 렌더링하지 않는다", () => {
			// Arrange & Act
			render(
				<SectionWrapper id="test-section" ariaLabel="테스트">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			expect(screen.queryByText(/부제목/)).not.toBeInTheDocument();
		});
	});

	describe("내부 컨테이너 클래스", () => {
		it("내부 컨테이너에 mx-auto 및 max-w-7xl 클래스가 있다", () => {
			// Arrange & Act
			const { container } = render(
				<SectionWrapper id="test-section" ariaLabel="테스트">
					<p>내용</p>
				</SectionWrapper>,
			);

			// Assert
			const innerContainer = container.querySelector(".mx-auto.max-w-7xl");
			expect(innerContainer).toBeInTheDocument();
		});
	});
});
