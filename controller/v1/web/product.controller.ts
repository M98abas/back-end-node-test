import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ProductController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.product.findMany({
      where: {
        active: true,

        // amount:
      },
      include: {
        rates: true,
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

    const data: any = await prisma.product.findMany({
      where: {
        active: true,
        id,
      },
      include: {
        rates: true,
        sizes: {
          include: {
            product_description: true,
          },
        },
      },
    });

    if (data.length === 0) return errRes(res, { msg: "لا توجد بيانات " });
    return okRes(res, { data }, 200);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async add(req: any, res: any): Promise<object> {
    try {
      // get body
      const body: any = req.body;
      // Body validation
      const notValide = validate(body, Validation.product());
      console.log(notValide);
      console.log(body);

      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });
      // add item in DB
      const items: any = await prisma.product.create({
        data: {
          name: body.name,
          dateBuying: new Date(body.dateBuying),
          brandsId: parseInt(body.brandsId),
          amount: body.amount,
          priceSell: body.priceSell,
          img_primary: body.img_primary,
          PriceBuy: body.PriceBuy,
          description: body.description,
          added_by: req.user.id,
          edited_by: req.user.id,
        },
      });
      // add images
      let images = body.imgURl;
      // for (let img in body.imgURl)
      for (let img in images)
        await prisma.images.create({
          data: {
            image_url: img,
            product_id: items.id,
          },
        });
      // add otherStaff
      let sizes = body.size;
      for (let i = 0; i < sizes.length; i++) {
        console.log(sizes[i]);
        await prisma.sizes.create({
          data: {
            sizes_string: sizes[i].string,
            size_number: parseInt(sizes[i].number),
            product_id: items.id,
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
   * @returns
   */
  static async addProductDescription(
    req: Request,
    res: Response
  ): Promise<object> {
    try {
      // get body
      const body: any = req.body;
      // Body validation
      console.log(body);

      const notValide = validate(body, Validation.prodDesc());
      console.log(notValide);

      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });

      const items: any = await prisma.product_description.create({
        data: {
          amount: body.amount,
          color: body.color,
          sizesId: parseInt(body.sizesId),
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
      const notValide = validate(body, Validation.product(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });

      // update data
      const data: any = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name: body.name,
          amount: body.amount,
          priceSell: body.priceSell,
          PriceBuy: body.PriceBuy,
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
      // update data
      const data: any = await prisma.product.update({
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
