import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class BrandsController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    try {
      const data: any = await prisma.brands.findMany({
        where: {
          active: true,
        },
      });

      if (data.length === 0) return errRes(res, { msg: "لا توجد بيانات " });
      let dicount: any;
      for (let i = 0; i < data.length; i++) {
        dicount = await prisma.discount.findMany({
          where: {
            target: "brands",
            target_id: data[i].id,
          },
          select: {
            value: true,
            end_at: true,
          },
        });
        data[i].dicount = dicount;
      }
      return okRes(res, { data }, 200);
    } catch {
      return errRes(res, "Something wrong");
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getOne(req: Request, res: Response): Promise<object> {
    const id = parseInt(req.params.id);
    const data: any = await prisma.brands.findMany({
      where: {
        active: true,
        id,
      },
    });

    if (data.length === 0) return errRes(res, "لا توجد بيانات ");
    let dicount;
    for (let i = 0; i < data.length; i++) {
      dicount = await prisma.discount.findMany({
        where: {
          target: "brands",
          target_id: data[i].id,
        },
        select: {
          value: true,
          end_at: true,
        },
      });
      data[i].dicount = dicount;
    }
    return okRes(res, data, 200);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getOneWithProduct(req: Request, res: Response): Promise<object> {
    const id = parseInt(req.params.id);
    const data: any = await prisma.brands.findMany({
      where: {
        id,
        active: true,
      },
      include: {
        product: true,
      },
    });

    if (data.length === 0) return errRes(res, { msg: "لا توجد بيانات " });
    return okRes(res, data, 200);
  }

  /**
   * @Brands
   * @param req
   * @param res
   * @returns
   */
  static async add(req: Request, res: Response): Promise<object> {
    try {
      // get body
      const body: any = req.body;
      // Body validation
      const notValide = validate(body, Validation.brands());
      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });
      // add item in DB
      const items: any = await prisma.brands.create({
        data: {
          name: body.name,
          imgUrl: body.imgUrl,
          categoryId: body.categoryId,
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
      const notValide = validate(body, Validation.brands(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.brands.update({
        where: { id: parseInt(id) },
        data: {
          name: body.name,
          imgUrl: body.imgUrl,
          categoryId: body.categoryId,
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
      const body: any = req.body;
      const id = req.params.id;
      // validate data
      const notValide = validate(body, Validation.brands(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.brands.update({
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
