import { Request, Response, NextFunction } from "express";

export const validRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;

  const errors = [];

  if (!name) {
    // return res.status(400).json({ msg: "Please add your name" });
    errors.push("Please add your name");
  } else if (name.length > 20) {
    // return res.status(400).json({ msg: "Your name is up to 20 chars long." });
    errors.push("Your name is up to 20 chars long.");
  }

  if (!account) {
    // return res.status(400).json({ msg: "Please add email or phone number" });
    errors.push("Please add email or phone number");
  } else if (!validPhone(account) && !validateEmail(account)) {
    // return res
    //   .status(400)
    //   .json({ msg: "email or phone number formate is incorrect" });
    errors.push("email or phone number formate is incorrect");
  }

  if (password?.length < 6) {
    // return res.status(400).json({ msg: "Password must be atleast 6 chars." });
    errors.push("Password must be atleast 6 chars.");
  }
  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
};

export function validPhone(phone: string) {
  const re = /^[+]/g;
  return re.test(phone);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
