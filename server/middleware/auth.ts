import { Response, NextFunction } from "express";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import { IDecodedToken, IReqAuth } from "../config/interface";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  console.log("token", token);
  if (!token) return res.status(400).json({ msg: "Invalid Authentication" });
  try {
    const decoded = <IDecodedToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded)
      return res
        .status(400)
        .json({ msg: "You Are Not Authorised For This Operation" });

    const user = await Users.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    req.user = user;

    next();
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

export default auth;
