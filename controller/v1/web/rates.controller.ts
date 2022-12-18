import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class RatesController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async add(req: any, res: any): Promise<object> {
    try {
      const user = req.user;
      // get body
      const body: any = req.body;
      // Body validation
      const notValide = validate(body, Validation.brands());
      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });

      let items: any = await prisma.usersProductRate.findMany({
        where: {
          productId: body.productId,
          userId: user.id,
        },
      });
      if (items) {
        let ratesResult = (body.rates * 6) / items.rates;
        // add item in DB
        items = await prisma.usersProductRate.update({
          where: {
            id: items.id,
          },
          data: {
            rates: ratesResult,
            productId: body.productId,
            userId: user.id,
          },
        });
      } else {
        items = await prisma.usersProductRate.create({
          data: {
            rates: body.rates,
            productId: body.productId,
            userId: user.id,
          },
        });
      }
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
  static async update(req: any, res: any): Promise<object> {
    try {
      const user = req.user;

      // get body data
      const body = req.body;
      const id = req.params.id;
      // validate data
      const notValide = validate(body, Validation.brands(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.usersProductRate.update({
        where: { id: parseInt(id) },
        data: {
          rates: body.rates,
          productId: body.productId,
          userId: user.id,
        },
      });
      return errRes(res, { data });
    } catch (err) {
      return errRes(res, `حدث خطأ ما ${err}`);
    }
  }
}
