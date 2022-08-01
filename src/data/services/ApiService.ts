import axios from "axios";

const baseUrl = "https://ediaristas-api-php.herokuapp.com";

export const ApiService = axios.create({
  baseURL: baseUrl,
  headers: {
    "content-Type": "application/json",
  },
});
