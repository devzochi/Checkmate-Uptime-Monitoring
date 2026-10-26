import api from "./api";

const data = (request) => request.then((response) => response.data);

// The alert schema intentionally has no request or response body definition.
export const getAlerts = () => data(api.get("/api/alerts/alert/"));
export const createAlert = (payload) =>
  data(api.post("/api/alerts/alert/", payload));

export const getDeployments = () => data(api.get("/api/deployments/"));
export const getDeployment = (id) => data(api.get(`/api/deployments/${id}/`));
export const getDeploymentIntegrations = () =>
  data(api.get("/api/deployments/integrations/"));
export const createDeploymentIntegration = (payload) =>
  data(api.post("/api/deployments/integrations/", payload));
export const getDeploymentIntegration = (id) =>
  data(api.get(`/api/deployments/integrations/${id}/`));
export const updateDeploymentIntegration = (id, payload) =>
  data(api.put(`/api/deployments/integrations/${id}/`, payload));
export const deleteDeploymentIntegration = (id) =>
  api.delete(`/api/deployments/integrations/${id}/`);
export const triggerDeployment = ({ serviceId, branch }) =>
  data(
    api.post("/api/deployments/trigger/", { service_id: serviceId, branch }),
  );

export const getOrganization = () => data(api.get("/api/organization/"));
export const createOrganization = (payload) =>
  data(api.post("/api/organization/", payload));
export const getOrganizationMembers = () =>
  data(api.get("/api/organization-member/"));
export const createOrganizationMember = (payload) =>
  data(api.post("/api/organization-member/", payload));

export const getAutoheals = () => data(api.get("/api/healer/autoheal/"));
export const createAutoheal = (payload) =>
  data(api.post("/api/healer/autoheal/", payload));
export const getAutoheal = (id) => data(api.get(`/api/healer/autoheal/${id}/`));
export const updateAutoheal = (id, payload) =>
  data(api.put(`/api/healer/autoheal/${id}/`, payload));
export const deleteAutoheal = (id) => api.delete(`/api/healer/autoheal/${id}/`);
export const getAutohealLogs = (id) =>
  data(api.get(`/api/healer/autoheal/logs/${id}/`));
export const getAutohealLogDetail = (id) =>
  data(api.get(`/api/healer/autoheal/logs/${id}/detail/`));
export const mimicAutoheal = (payload) =>
  data(api.post("/api/healer/mimick/", payload));
