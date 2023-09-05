import axios from "axios";

export const postAPI = async (url: string, post: object, token?:string) => {
    const res = await axios.post(`https://dwypdj-5000.csb.app/api/${url}`,post,{
        headers : {
            Authorization : token
        }
    })
    return res;
}
