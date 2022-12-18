import { errRes } from "../utils/util.services";
import * as jwt from "jsonwebtoken";
import CONFIG from "../config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req: any, res: any, next: any) => {
  // get token
  const token = req.headers.token;
  // console.log(token);
  if (!token) return errRes(res, { msg: "لا يوجد توكن" });

  // verfie token
  try {
    // get payload
    let payload: any;
    payload = jwt.verify(token, CONFIG.jwtUserLoginSecret);

    // Find the user and add to Request
    let user: any = await prisma.admin.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user) return errRes(res, "غير مسموح لك باجراء هذه العملية");
    }
    // Add user data to request param
    req.user = user;
    return next();
  } catch (err) {
    return errRes(res, { msg: `The error in ${err}` });
  }
};
