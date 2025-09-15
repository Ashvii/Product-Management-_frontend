import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // Laravel backend

export const commonApi = async (httpRequest, url, reqBody, reqHeader = {}) => {
  const isFormData = reqBody instanceof FormData;

  const reqConfig = {
    method: httpRequest,
    url: `${BASE_URL}${url}`,
    data: reqBody,
    headers: {
      ...reqHeader,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  try {
    const res = await axios(reqConfig);
    return res;
  } catch (err) {
    // Throw the error so caller can catch 401 properly
    throw err;
  }
};
