import { Request, Response } from "express";
import { errRes, getOtp, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import bcrypt from "bcrypt";
import CONFIG from "../../../config";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import smsSend from "../../../utils/SMSOtp";

const prisma = new PrismaClient();

export default class UserController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.user.findMany({});

    if (data.length === 0) return errRes(res, { msg: "لا توجد بيانات " });
    return okRes(res, data, 200);
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getOne(req: Request, res: Response): Promise<object> {
    const id = req.params.id;
    let data: any;
    if (id)
      data = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          orders: {
            include: {
              ordersProducts: true,
            },
          },
        },
      });
    console.log(data);

    if (!data) return errRes(res, { msg: "لا توجد بيانات " });
    return okRes(res, { data }, 200);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAbsolute(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.user.findMany({});

    if (data.length === 0) return errRes(res, { msg: "لا توجد بيانات " });
    return okRes(res, data, 200);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async register(req: Request, res: Response): Promise<object> {
    try {
      // get body
      let body = req.body;
      const otp: any = getOtp();
      // Body validation
      const notValide = validate(body, Validation.userRegister());
      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });

      // check if the password is less than 8 characters
      if (body.password.length <= 7)
        return errRes(res, { msg: "الرمز جدا ضعيف!!" });
      // create Salt
      const salt: any = await bcrypt.genSalt(12);
      // Encrypt Password
      const password: any = await bcrypt.hash(body.password, salt);
      body.password = password;

      // check if the user already exists
      let users: any = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (users) {
        return errRes(res, {
          msg: "الايميل موجود من قبل الرجاء استخدام ايميل جديد",
        });
      } else {
        users = await prisma.user.create({
          data: {
            fullName: body.fullName,
            email: body.email,
            password: body.password,
            address: body.address,
            phoneNumber: body.phoneNumber,
            description: body.description,
            profit: 0,
            type: body.type,
            otp,
          },
        });
      }
      smsSend(`OTP is ${otp}`, users.phoneNumber);
      // make up .userRegister
      let token = jwt.sign({ email: body.email }, CONFIG.jwtUserLoginSecret);

      // Return Response if Done
      return okRes(res, {
        token,
      });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async validateOtp(req: any, res: any): Promise<object> {
    // get OTP && User
    const body: any = req.body;
    const user: any = req.user;

    // validate otp
    const notValided = validate(body, Validation.otp());
    console.log(notValided, user.otp, body.otp);
    if (notValided) return errRes(res, "Error");

    if (user.otp !== parseInt(body.otp)) {
      // generate new  otp and save it
      const newOtp: any = getOtp();

      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          otp: newOtp,
        },
      });
      smsSend(`Your OTP is ${newOtp}`, user.phoneNumber);
      return errRes(res, "الرمز خطأ الرجاء المحاولة مرة اخرى");
    }

    // update to verify
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        verified: true,
      },
    });

    return okRes(res, { msg: "كل شيء بخير" });
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async login(req: Request, res: Response): Promise<object> {
    try {
      // get body
      const body = req.body;

      // validate body
      const notValide = validate(body, Validation.login());
      if (notValide) return errRes(res, "الرجاء التاكد من المعرومات المدخلة ");

      // Get the user from DB
      let user: any = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (!user) return errRes(res, "الايميل غير موجود الرجاء ادخل ايميل جديد");

      // compare password
      let valide = await bcrypt.compare(body.password, user.password);
      if (!valide) return errRes(res, "الرمز خطأ الرجاء حاول مرة اخرى");

      // update data in DB
      user = await prisma.user.update({
        where: { email: user.email },
        data: {
          verified: true,
        },
      });

      // create the Token
      let token = jwt.sign({ email: body.email }, CONFIG.jwtUserLoginSecret);
      return okRes(res, { token, verified: user.verified });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param
   */
  static async update(req: Request, res: Response): Promise<object> {
    try {
      // get body data
      const body = req.body;
      const id = req.params.id;
      // validate data
      const notValide = validate(body, Validation.userRegister(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.user.update({
        where: { id },
        data: {
          fullName: body.name,
          email: body.email,
          password: body.password,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param
   */
  static async activate(req: Request, res: Response): Promise<object> {
    try {
      // get body data
      const body = req.body;
      const id = req.params.id;
      // validate data
      const notValide = validate(body, Validation.userRegister(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.user.update({
        where: { id },
        data: {
          active: body.active,
          verified: body.verified,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
}
