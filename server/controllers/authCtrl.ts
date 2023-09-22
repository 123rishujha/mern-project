import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Users from "../models/userModel";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateToken";
import sendMail from "../config/sendMail";
import { validateEmail } from "../middleware/valid";
import { IDecodedToken, IUser } from "../config/interface";

const CLIENT_URL = `${process.env.BASE_URL}`;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;
      const user = await Users.findOne({ account });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Email or Phone number already exists." });
      }
      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, account, password: passwordHash };

      const active_token = generateActiveToken({ newUser });

      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(account)) {
        try {
          await sendMail(account, url, "Verify your email address");
          return res.json({ msg: "Success! Please check your email." });
        } catch (err: any) {
          console.log("error while sending mail", err);
          return res.status(500).json({ msg: "Error sending email." });
        }
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );
      const { newUser } = decoded;

      if (!newUser)
        return res.status(400).json({ msg: "Invalid authentication" });

      const user = await Users.findOne({ account: newUser?.account });
      if (user) return res.status(400).json({ msg: "Account already exist" });

      const new_user = new Users(newUser);

      await new_user.save();
      res.json({ msg: "Account has been Activated!" });
    } catch (err: any) {
      // let errMsg;
      // if (err.code === 11000) {
      //   errMsg = Object.keys(err.keyValue)[0] + " already exist.";
      // } else {
      //   console.log(err);
      //   errMsg = err?.message;
      // }
      // return res.status(500).json({ msg: errMsg });
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;
      let user = await Users.findOne({ account });
      if (!user) return res.status(400).json({ msg: "Account doesn't exist" });
      loginUser(user, password, res);
    } catch (err: any) {
      console.log("login error", err);
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged Out!" });
    } catch (err: any) {
      console.log("logout error", err);
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req?.cookies?.refreshtoken;
      // console.log("cookie", req.cookies.refreshtoken);
      if (!rf_token) return res.status(500).json({ msg: "Please Login now!" });
      const decoded = <IDecodedToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id)
        // return res.status(500).json({ msg: "Please Login now!" };
        return res.status(500).json({ msg: "Please Login now!" });

      const user = await Users.findById(decoded.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "This account does not exist." });
      const access_token = generateAccessToken({ id: user.id });
      res.json({ access_token, user });
    } catch (err: any) {
      console.log("logout error", err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("ismatch", isMatch);
    if (!isMatch) return res.status(400).json({ msg: "incorrect password" });
    const access_token = generateAccessToken({ id: user._id });
    const refresh_token = generateRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.json({
      msg: "Login Successfull",
      access_token,
      user: { ...user._doc, password: "" },
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

export default authCtrl;
