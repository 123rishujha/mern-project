import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import NotFound from "../global/NotFound";

import {
  IUserProfile,
  InputChange,
  RootStore,
  FormSubmit,
} from "../../utils/TypeScript";

import { updateUser, resetPassword } from "../../redux/actions/userAction";

const UserInfo = () => {
  const initalState = {
    name: "",
    account: "",
    avatar: "",
    password: "",
    cf_password: "",
  };
  const { auth } = useSelector((store: RootStore) => store);
  const dispatch = useDispatch();

  const [user, setUser] = useState<IUserProfile>(initalState);
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const { name, avatar, password, cf_password } = user;

  if (!auth.user) return <NotFound />;

  let imageUrl: string | undefined;
  if (typeof avatar === "string") {
    imageUrl = avatar;
  } else {
    imageUrl = URL.createObjectURL(avatar);
  }

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleChange = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      const file = files[0];
      setUser({ ...user, avatar: file });
    }
  };

  const handleSubmti = (e: FormSubmit) => {
    e.preventDefault();
    if (name || avatar) {
      dispatch(updateUser(avatar as File, name, auth));
    }
    if (password && auth?.access_token)
      dispatch(resetPassword(password, cf_password, auth.access_token));
  };

  return (
    <form className="profile_info" onSubmit={handleSubmti}>
      {/* image */}
      <div className="info_avatar">
        <img src={imageUrl || auth.user.avatar} alt="avatar" />
        <span>
          <i className="fas fa-camera" />
          <p>change</p>
          <input
            type="file"
            accept="image/*"
            id="file_up"
            name="file"
            onChange={handleChange}
          />
        </span>
      </div>
      {/* name */}
      <div className="form-group my-3">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          defaultValue={auth.user.name}
          onChange={handleChangeInput}
        />
      </div>
      {/* account */}
      <div className="form-group my-3">
        <label htmlFor="account">Account</label>
        <input
          type="text"
          className="form-control"
          id="account"
          name="account"
          defaultValue={auth.user.account}
          onChange={handleChangeInput}
          disabled={true}
        />
      </div>

      {auth.user.type !== "register" && (
        <small className="text-danger">
          * Quick login account with {auth?.user?.type} can't use this feature
        </small>
      )}

      {/* password */}
      <div className="form-group my-3">
        <label htmlFor="password">Password</label>
        <div className="pass">
          <input
            type={typePass ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={handleChangeInput}
            disabled={auth?.user?.type !== "register"}
          />
          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? "Hide" : "Show"}
          </small>
        </div>
      </div>
      {/* confirm password */}
      <div className="form-group my-3">
        <label htmlFor="cf_password">Confirm Password</label>
        <div className="pass">
          <input
            type={typeCfPass ? "text" : "password"}
            className="form-control"
            id="cf_password"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
            disabled={auth?.user?.type !== "register"}
          />
          <small onClick={() => setTypeCfPass(!typeCfPass)}>
            {typeCfPass ? "Hide" : "Show"}
          </small>
        </div>
      </div>
      <button className="btn btn-dark w-100" type="submit">
        Update
      </button>
    </form>
  );
};

export default UserInfo;
//modified
