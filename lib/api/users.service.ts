import { httpClient } from "@/lib/api/http-client";
import { UserMeResponse } from "@/models/auth.model";

const endpoint = "/api/users/me";

export const UsersService = {
  async getMe(): Promise<UserMeResponse> {
    const response = await httpClient.request(endpoint, { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch user profile");
    }

    return data as UserMeResponse;
  },
};
