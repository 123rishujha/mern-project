import { Dispatch } from "redux";
import { IBlog } from "../../utils/TypeScript";
import { imageUpload } from "../../utils/ImageUpload";
import { ALERT, IAlertType } from "../types/alertType";
import { postAPI } from "../../utils/FetchData";

export const createBlog =
  (blog: IBlog, token: string) => async (dispatch: Dispatch<IAlertType>) => {
    let url;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      if (typeof blog.thumbnail !== "string") {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      } else {
        url = blog.thumbnail;
      }
      const newBlog = { ...blog, thumbnail: url };
      // console.log(newBlog);
      const res = await postAPI("blog", newBlog, token);
      console.log(res);
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
