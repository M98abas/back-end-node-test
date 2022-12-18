import { Request, Response } from "express";
import { errRes, okRes } from "../../../utils/util.services";
import { validate } from "validate.js";
import Validation from "../../../utils/Validation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class OrderController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getAll(req: Request, res: Response): Promise<object> {
    const data: any = await prisma.orders.findMany({
      where: {
        active: true,
      },
      include: {
        ordersProducts: true,
        User: {
          select: {
            fullName: true,
            phoneNumber: true,
          },
        },
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
    let data: any;
    if (id)
      data = await prisma.orders.findMany({
        where: {
          id,
        },
        include: {
          User: {
            select: {
              fullName: true,
              phoneNumber: true,
            },
          },
          PromoCode: {
            select: {
              persantage: true,
              promoCode: true,
            },
          },
          ordersProducts: {
            include: {
              Product: {
                select: {
                  name: true,
                  priceSell: true,
                },
              },
              Sizes: {
                select: {
                  sizes_string: true,
                  size_number: true,
                },
              },
              Product_description: {
                select: {
                  color: true,
                },
              },
            },
          },
        },
      });
    console.log(id);

    if (!data) return errRes(res, "لا توجد طلبات");
    return okRes(res, { data }, 200);
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
      const profit: any = await prisma.promoCode.findMany({
        where: {
          id: body.promoCodeId,
          active: true,
        },
      });
      const notValide = validate(body, Validation.orders());
      if (notValide)
        return errRes(res, { msg: "الرجاء التاكد من المعلومات المدخلة" });

      // add item in DB
      const items: any = await prisma.orders.create({
        data: {
          address: body.address,
          status: body.status,
          total_cost: body.total_cost,
          userId: body.userId,
          fee_dataId: body.fee_dataId,
          promoCodeId: body.promoCodeId,
        },
      });
      // let sumation: any;
      let orderItems: any;
      for (var i = 0; i < body.basket.length; i++) {
        orderItems = await prisma.ordersProducts.create({
          data: {
            amount: body.basket[i].amount,
            sub_total: body.basket[i].sub_total,
            ordersId: items.id,
            productId: body.basket[i].productId,
            product_descriptionId: body.basket[i].product_descriptionId,
            sizesId: body.basket[i].sizesId,
          },
        });

        // Update product description amount
        await prisma.product_description.update({
          where: {
            id: body.basket[i].product_descriptionId,
          },
          data: {
            amount: {
              decrement: body.basket[i].amount,
            },
          },
        });
        // Update product amount
        await prisma.product.update({
          where: {
            id: body.basket[i].productId,
          },
          data: {
            amount: {
              decrement: body.basket[i].amount,
            },
          },
        });
      }

      let userProfit: any;

      // make penfit for users
      if (profit[0].userId) {
        userProfit = await prisma.user.update({
          where: {
            id: profit[0].userId,
          },
          data: {
            profit: {
              increment: profit[0].profit,
            },
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
  static async update(req: Request, res: Response): Promise<object> {
    try {
      // get body data
      const body = req.body;
      const id = req.params.id;
      // validate data
      const notValide = validate(body, Validation.category(false));
      if (notValide) return errRes(res, { msg: "Data not valid" });
      // update data
      const data: any = await prisma.orders.update({
        where: { id: parseInt(id) },
        data: {
          address: body.address,
          status: body.status,
          total_cost: body.total_cost,
          userId: body.userId,
          fee_dataId: body.fee_dataId,
          promoCodeId: body.promoCodeId,
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
      const data: any = await prisma.orders.update({
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
