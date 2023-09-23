import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";

function SocialLogin() {
  const onSuccess = (googleUser: GoogleLoginResponse) => {
    console.log(googleUser);
  };

  return (
    <div>
      <GoogleLogin
        client_id={`${process.env.REACT_APP_MAIL_CLIENT_ID}`}
        cookiepolicy="single_host_origin"
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default SocialLogin;
