import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import bcrypt from "bcrypt";
import CONFIG from "../../../config";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AdminController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.admin.findMany({
      where: {
        active: true,
      },
    });

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
    const email: any = req.headers.email;
    const id: any = parseInt(req.params.id);
    const data: any = await prisma.admin.findMany({
      where: {
        id,
        email,
      },
    });

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
      const body: any = req.body;

      // Body validation
      const notValide = validate(body, Validation.adminRegister());
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
      let user: any = await prisma.admin.findUnique({
        where: { email: body.email },
      });
      if (user) {
        return errRes(res, {
          msg: "الايميل موجود من قبل الرجاء استخدام ايميل جديد",
        });
      } else {
        user = await prisma.admin.create({
          data: {
            name: body.name,
            email: body.email,
            password: body.password,
          },
        });
      }

      // Return Response if Done
      return okRes(res, {
        user,
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
  static async login(req: Request, res: Response): Promise<object> {
    try {
      // get body
      const body = req.body;

      // validate body
      const notValide = validate(body, Validation.login());
      if (notValide) return errRes(res, "الرجاء التاكد من المعرومات المدخلة ");

      // Get the user from DB
      let user: any = await prisma.admin.findUnique({
        where: {
          email: body.email,
        },
      });
      if (!user) return errRes(res, "الايميل غير موجود الرجاء ادخل ايميل جديد");

      // compare password
      let valide = await bcrypt.compare(body.password, user.password);
      if (!valide) return errRes(res, "الرمز خطأ الرجاء حاول مرة اخرى");

      // create the Token
      let token = jwt.sign({ email: body.email }, CONFIG.jwtUserSecret);
      return okRes(res, { token, verified: user.verified });
    } catch (err) {
      return errRes(res, `Something went wrong ${err}`);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param
   */
  static async update(req: any, res: any): Promise<object> {
    try {
      // get body data
      const body = req.body;
      const id = parseInt(req.user.id);
      // validate data
      const notValide = validate(body, Validation.adminRegister(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.admin.update({
        where: { id },
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `Something went wrong ${err}`);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param
   */
  static async activate(req: any, res: any): Promise<object> {
    try {
      // get body data
      const body = req.body;
      const id = parseInt(req.user.id);

      // validate data
      const notValide = validate(body, Validation.adminRegister(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.admin.update({
        where: { id },
        data: {
          active: body.active,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `Something went wrong ${err}`);
    }
  }
}
