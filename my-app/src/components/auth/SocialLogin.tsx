import { useDispatch } from "react-redux";
// import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";
import { GoogleLogin, GoogleLoginResponse } from "./google";

import { googleLogin } from "../../redux/actions/authAction";

function SocialLogin() {
  const dispatch = useDispatch();
  const onSuccess = (googleUser: GoogleLoginResponse) => {
    // console.log(googleUser);
    const id_token = googleUser.getAuthResponse().id_token;
    dispatch(googleLogin(id_token));
  };

  return (
    <div style={{ width: "100%" }}>
      <GoogleLogin
        client_id={`${process.env.REACT_APP_MAIL_CLIENT_ID}`}
        cookiepolicy="single_host_origin"
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default SocialLogin;
