import axios, { AxiosError } from "axios";
import { Constants } from "../enums";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiService = () => {
  const token = localStorage.getItem(Constants.TOKEN);
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const ignoredTokenPaths = ["/register", "/login"];
  /**
   * Generic function to make API requests.
   * @param {string} url - The URL endpoint to call (e.g., '/users', '/products/123').
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, PATCH). Defaults to 'GET'.
   * @param {object} data - The request body for POST, PUT, and PATCH requests. Optional.
   * @param {object} headers - Custom headers to include in the request. Optional.
   * @returns {Promise<object>} - A promise that resolves to an object containing:
   *   - `data`: The response data (if successful).
   *   - `status`: The HTTP status code.
   *   - `statusText`: The HTTP status text (e.g., 'OK', 'Not Found').
   *   - `success`: A boolean indicating whether the request was successful (status code 200-299).
   *   - `error`: An error object (if the request failed).
   *   - `message`: A user-friendly error message (if the request failed).
   */
  const request = async (
    url: string,
    method = "GET",
    data: object | null = null,
    headers: object = {},
  ) => {
    try {
      const response = await axios({
        method: method.toUpperCase(),
        url: `${API_BASE_URL}${url}`,
        data,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          ...(ignoredTokenPaths.includes(url) ? {} : { ...authHeaders }),
        },
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        success: response.status >= 200 && response.status < 300,
        error: null,
        message: null, // No error message on success
      };
    } catch (error) {
      console.error("API Request Error:", error);

      let message = "An unexpected error occurred.";
      const err = error as AxiosError;
      if (err.response) {
        message =
          (err.response.data as { message: string })?.message ||
          `Request failed with status ${err.response.status}`;

        if (err.response.status === 400) {
          message = "Bad Request. Please check your input."; //Example Custom Error message
        } else if (err.response.status === 401) {
          message = "Unauthorized. Please log in.";
        } else if (err.response.status === 403) {
          message =
            "Forbidden. You do not have permission to access this resource.";
        } else if (err.response.status === 404) {
          message = "Resource not found.";
        } else if (err.response.status === 500) {
          message = "Internal Server Error. Please try again later.";
        }
      } else if (err.request) {
        message =
          "No response received from the server.  Please check your network connection.";
      } else {
        message =
          (error as { message: string })?.message ||
          "An error occurred while making the request.";
      }

      return {
        data: null,
        status: err.response?.status || 500, // Use error.response.status if available, otherwise default to 500
        statusText: err.response?.statusText || "Error",
        success: false,
        error,
        message,
      };
    }
  };
  const getService = async (url: string, headers: object = {}) => {
    return await request(url, "GET", null, headers);
  };

  const postService = async (
    url: string,
    data: object,
    headers: object = {},
  ) => {
    return request(url, "POST", data, headers);
  };

  const putService = async (
    url: string,
    data: object,
    headers: object = {},
  ) => {
    return await request(url, "PUT", data, headers);
  };

  const patchService = async (
    url: string,
    data: object,
    headers: object = {},
  ) => {
    return await request(url, "PATCH", data, headers);
  };

  const deleteService = async (url: string, headers: object = {}) => {
    return await request(url, "DELETE", null, headers);
  };

  return { getService, postService, patchService, deleteService, putService };
};

export default apiService;
