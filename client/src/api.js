import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const fetchLinks = () => API.get("/links");
export const createLink = (data) => API.post("/links", data);
export const removeLink = (id) => API.delete(`/links/${id}`);
export const pinLink = (id) => API.patch(`/links/${id}/pin`);