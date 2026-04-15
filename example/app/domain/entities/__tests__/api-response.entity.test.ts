import type { ApiResponse } from "../api-response.entity";

describe("ApiResponse", () => {
	it("should represent a success response with data", () => {
		const response: ApiResponse<{ id: string }> = {
			success: true,
			data: { id: "abc-123" },
		};

		expect(response.success).toBe(true);
		if (response.success) {
			expect(response.data.id).toBe("abc-123");
		}
	});

	it("should represent an error response", () => {
		const response: ApiResponse<never> = {
			success: false,
			error: "서버 오류가 발생했습니다.",
		};

		expect(response.success).toBe(false);
		if (!response.success) {
			expect(response.error).toBe("서버 오류가 발생했습니다.");
		}
	});

	it("should narrow types via discriminated union", () => {
		const handle = (res: ApiResponse<{ id: string }>) => {
			if (res.success) {
				return res.data.id;
			}
			return res.error;
		};

		expect(handle({ success: true, data: { id: "x" } })).toBe("x");
		expect(handle({ success: false, error: "fail" })).toBe("fail");
	});
});
