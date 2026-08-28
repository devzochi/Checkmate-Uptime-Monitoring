import api from "./api";

export const getServices = async () => {
  try {
    const response = await api.get("/api/services/3");

    console.info("[Services API] Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "[Services API] Backend error:",
      error.response?.data ?? error.message,
    );
    throw error;
  }
};

export const getUptime = async () => {
  try {
    const response = await api.get("/api/services/3/uptime/");

    console.info("[Uptime API] Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "[Services API] Backend error:",
      error.response?.data ?? error.message,
    );
    throw error;
  }
};
