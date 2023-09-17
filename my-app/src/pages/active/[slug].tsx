import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from "../../components/alert/Alert";
import { postAPI } from "../../utils/FetchData";
import { IParams } from "../../utils/TypeScript";

const Active = () => {
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const { slug }: IParams = useParams();

  useEffect(() => {
    if (slug) {
      postAPI("active", { active_token: slug })
        .then((res) => setSuccess(res?.data?.msg))
        .catch((err) => setErr(err?.response?.data?.msg));
    }
  }, []);

  return (
    <div>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
    </div>
  );
};

export default Active;
