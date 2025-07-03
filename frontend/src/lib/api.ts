import axios from "axios"

// Configure axios to point to the backend API
// When served from the same origin, a relative path is sufficient
const api = axios.create({
  baseURL: "/api",
})

export default api
