import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log("env", backendUrl);

export const postAPI = async (url: string, post: object, token?: string) => {
  const res = await axios.post(`${backendUrl}/api/${url}`, post, {
    withCredentials: true,
    headers: {
      Authorization: token,
    },
  });
  return res;
};

export const getAPI = async (url: string, token?: string) => {
  const res = await axios.get(`${backendUrl}/api/${url}`, {
    withCredentials: true,
    headers: {
      Authorization: token,
    },
  });
  return res;
};
