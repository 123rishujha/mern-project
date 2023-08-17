import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Users from "../models/userModel";
import { generateActiveToken } from "../config/generateToken";
import sendMail from "../config/sendMail";
import { validateEmail } from "../middleware/valid";
import { IDecodedToken } from "../config/interface";

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

      const user = new Users(newUser);
      await user.save();
      res.json({ msg: "Account has been Activated!" });
    } catch (err: any) {
      let errMsg;
      if (err.code === 11000) {
        errMsg = Object.keys(err.keyValue)[0] + " already exist.";
      } else {
        console.log(err);
        errMsg = err?.message;
      }
      return res.status(500).json({ msg: errMsg });
    }
  },
};

export default authCtrl;
