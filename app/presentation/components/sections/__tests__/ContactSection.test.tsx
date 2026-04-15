import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import type { ActionResponse } from "~/domain/contact/types";
import ContactSection from "../ContactSection";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

// ─── 기본 렌더링 (라우팅 컨텍스트 제공, action 없음) ───────────────────────────

describe("ContactSection - 기본 렌더링", () => {
	const renderWithStub = () => {
		// Arrange: action 없이 라우팅 컨텍스트만 제공
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
			},
		]);
		return render(<Stub initialEntries={["/"]} />);
	};

	it("section에 id='contact'가 설정되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert: section이 렌더링될 때까지 대기 후 id 확인
		await screen.findByRole("heading", { name: /Contact Us/i });
		expect(document.getElementById("contact")).toBeInTheDocument();
	});

	it("'Contact Us' heading을 렌더링해야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByRole("heading", { name: /Contact Us/i })).toBeInTheDocument();
	});

	it("form이 존재하고 method='post'로 설정되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert: React Router <Form method="post">는 DOM에서 method="post"를 가짐
		// form 역할은 aria-label이 있을 때만 부여되므로 querySelector로 확인
		await screen.findByRole("heading", { name: /Contact Us/i });
		const form = document.querySelector("form");
		expect(form).not.toBeNull();
		expect(form).toHaveAttribute("method", "post");
	});

	it("이름 필드가 label 기준으로 렌더링되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByLabelText("이름")).toBeInTheDocument();
	});

	it("이메일 필드가 label 기준으로 렌더링되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByLabelText("이메일")).toBeInTheDocument();
	});

	it("문의 내용 필드가 label 기준으로 렌더링되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByLabelText("문의 내용")).toBeInTheDocument();
	});

	it("'문의하기' submit 버튼이 존재해야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByRole("button", { name: "문의하기" })).toBeInTheDocument();
	});

	it("연락처 정보 레이블(Phone, Email, Address, Business hours)이 렌더링되어야 한다", async () => {
		// Act
		renderWithStub();

		// Assert
		expect(await screen.findByText("Phone")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Address")).toBeInTheDocument();
		expect(screen.getByText("Business hours")).toBeInTheDocument();
	});
});

// ─── actionData - 에러 표시 ──────────────────────────────────────────────────

describe("ContactSection - actionData 에러 표시", () => {
	it("fieldErrors가 있을 때 이름 필드 에러 메시지를 표시해야 한다", async () => {
		// Arrange: action이 fieldErrors를 포함한 실패 응답을 반환
		const errorResponse: ActionResponse = {
			success: false,
			error: "유효성 검증 실패",
			fieldErrors: { name: ["이름은 필수 항목입니다"] },
		};
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return errorResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act: 폼 제출
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert: 에러 메시지가 표시되어야 함
		await waitFor(() => {
			expect(screen.getByText("이름은 필수 항목입니다")).toBeInTheDocument();
		});
	});

	it("fieldErrors가 있을 때 이메일 필드 에러 메시지를 표시해야 한다", async () => {
		// Arrange
		const errorResponse: ActionResponse = {
			success: false,
			error: "유효성 검증 실패",
			fieldErrors: { email: ["유효한 이메일 주소를 입력해주세요"] },
		};
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return errorResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert
		await waitFor(() => {
			expect(screen.getByText("유효한 이메일 주소를 입력해주세요")).toBeInTheDocument();
		});
	});

	it("fieldErrors가 있을 때 문의 내용 필드 에러 메시지를 표시해야 한다", async () => {
		// Arrange
		const errorResponse: ActionResponse = {
			success: false,
			error: "유효성 검증 실패",
			fieldErrors: { message: ["문의 내용은 필수 항목입니다"] },
		};
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return errorResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert
		await waitFor(() => {
			expect(screen.getByText("문의 내용은 필수 항목입니다")).toBeInTheDocument();
		});
	});

	it("success: false이고 fieldErrors 없을 때 일반 에러 메시지를 표시해야 한다", async () => {
		// Arrange
		const errorResponse: ActionResponse = {
			success: false,
			error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
		};
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return errorResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert
		await waitFor(() => {
			expect(
				screen.getByText("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."),
			).toBeInTheDocument();
		});
	});
});

// ─── actionData - 성공 표시 ──────────────────────────────────────────────────

describe("ContactSection - actionData 성공 표시", () => {
	it("success: true일 때 성공 메시지를 표시해야 한다", async () => {
		// Arrange: action이 성공 응답을 반환
		const successResponse: ActionResponse = { success: true, data: undefined };
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return successResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act: 폼 제출
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert: 성공 메시지가 렌더링되어야 함
		await waitFor(() => {
			expect(
				screen.getByText(/문의가 접수되었습니다|성공적으로 제출/i),
			).toBeInTheDocument();
		});
	});

	it("success: true일 때 폼 필드 대신 성공 UI를 표시해야 한다", async () => {
		// Arrange
		const successResponse: ActionResponse = { success: true, data: undefined };
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: ContactSection,
				action() {
					return successResponse;
				},
			},
		]);
		render(<Stub initialEntries={["/"]} />);

		// Act
		const submitButton = await screen.findByRole("button", { name: "문의하기" });
		fireEvent.click(submitButton);

		// Assert: 성공 상태에서는 submit 버튼이 사라지거나 성공 UI가 표시됨
		await waitFor(() => {
			// 성공 메시지가 있거나, 폼이 숨겨지는 방식 중 하나여야 함
			const successMessage = screen.queryByText(/문의가 접수되었습니다|성공적으로 제출/i);
			expect(successMessage).toBeInTheDocument();
		});
	});
});
