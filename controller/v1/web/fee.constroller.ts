import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class FeeController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.fee_data.findMany({
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
    const id = parseInt(req.params.id);
    const data: any = await prisma.fee_data.findMany({
      where: {
        id,
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
  static async add(req: Request, res: Response): Promise<object> {
    try {
      // get body
      const body: any = req.body;
      // Body validation
      const notValide = validate(body, Validation.fee());
      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });
      // add item in DB
      const items: any = await prisma.fee_data.create({
        data: {
          fee: body.fee,
          city: body.city,
        },
      });
      // Return Response if Done
      return okRes(res, { items });
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
      const notValide = validate(body, Validation.fee(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.fee_data.update({
        where: { id: parseInt(id) },
        data: {
          fee: body.fee,
          city: body.city,
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
      const notValide = validate(body, Validation.category(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.fee_data.update({
        where: { id: parseInt(id) },
        data: {
          active: body.active,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
}
