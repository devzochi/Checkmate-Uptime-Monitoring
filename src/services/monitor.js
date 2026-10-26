import api from "./api";

export const getServices = async () => {
  const response = await api.get("/api/services/");
  return response.data;
};

export const createService = async ({ name, url, organization }) => {
  const payload = { name, url };
  if (organization !== undefined && organization !== null) payload.organization = organization;
  const response = await api.post("/api/services/", payload);
  return response.data;
};

export const getService = async (id) => (await api.get(`/api/services/${id}`)).data;

export const updateService = async (id, { name, url }) =>
  (await api.put(`/api/services/${id}`, { name, url })).data;

export const deleteService = async (id) => {
  await api.delete(`/api/services/${id}`);
};

export const getUptime = async (id) =>
  (await api.get(`/api/services/${id}/uptime/`)).data;

export const getResponseTime = async (id) =>
  (await api.get(`/api/services/${id}/response-time/`)).data;

export const getIncidents = async (id) =>
  (await api.get(`/api/services/${id}/incidents/`)).data;
