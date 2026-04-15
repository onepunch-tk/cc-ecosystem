import type { ApiResponse } from "../api-response.entity";

describe("ApiResponse", () => {
	it("should represent a success response with data", () => {
		const response: ApiResponse<{ id: string }> = {
			success: true,
			data: { id: "abc-123" },
		};

		expect(response.success).toBe(true);
		expect(response.data?.id).toBe("abc-123");
		expect(response.error).toBeUndefined();
	});

	it("should represent an error response", () => {
		const response: ApiResponse<never> = {
			success: false,
			error: "서버 오류가 발생했습니다.",
		};

		expect(response.success).toBe(false);
		expect(response.data).toBeUndefined();
		expect(response.error).toBe("서버 오류가 발생했습니다.");
	});
});
