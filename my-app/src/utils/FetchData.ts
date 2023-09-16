import axios from "axios";

export const postAPI = async (url: string, post: object, token?: string) => {
  console.log("env", process.env.BACKEND_URL);
  const res = await axios.post(`https://c83vq2-8080.csb.app/api/${url}`, post, {
    headers: {
      Authorization: token,
    },
  });
  return res;
};
