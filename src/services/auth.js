import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post("/api/v1/auth/", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/v1/login/", credentials);

  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post("/api/v1/refresh/", {
    refresh: refreshToken,
  });

  return response.data;
};

const getUserIdFromAccessToken = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const payload = accessToken.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalizedPayload));

    return decodedPayload.user_id ?? null;
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  const userId = getUserIdFromAccessToken();

  if (!userId) {
    throw new Error("Unable to identify the signed-in user.");
  }

  const response = await api.get("/api/v1/auth/");
  const currentUser = response.data.find((user) => String(user.id) === String(userId));

  if (!currentUser) {
    throw new Error("The signed-in user's profile was not found.");
  }

  console.info("[Current user API] Backend response:", currentUser);
  return currentUser;
};
