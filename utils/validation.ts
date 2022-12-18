export default class Validation {
  constructor(parameters: any) {}
  static adminRegister = (must = true) => ({
    name: {
      presence: must,
      type: "string",
    },
    email: {
      presence: must,
      type: "string",
    },
    password: {
      presence: must,
      type: "string",
    },
  });
  static login = (must = true) => ({
    email: {
      presence: must,
      type: "string",
    },
    password: {
      presence: must,
      type: "string",
    },
  });
  static otp = (must = true) => ({
    otp: {
      presence: must,
      type: "string",
    },
  });
  static userRegister = (must = true) => ({
    fullName: {
      presence: must,
      type: "string",
    },
    email: {
      presence: must,
      type: "string",
    },
    password: {
      presence: must,
      type: "string",
    },

    address: {
      presence: must,
      type: "string",
    },
    phoneNumber: {
      presence: must,
      type: "string",
    },
    description: {
      presence: must,
      type: "string",
    },
  });
  static product = (must = true) => ({
    name: {
      presence: must,
      type: "string",
    },
    dateBuying: {
      presence: must,
      type: "string",
    },
    amount: {
      presence: must,
      type: "number",
    },
    priceSell: {
      presence: must,
      type: "number",
    },
    PriceBuy: {
      presence: must,
      type: "number",
    },
    description: {
      presence: must,
      type: "string",
    },
    img_primary: {
      presence: must,
      type: "string",
    },
  });
  static category = (must = true) => ({
    title: {
      presence: must,
      type: "string",
    },
    description: {
      presence: must,
      type: "string",
    },
    imageURl: {
      presence: must,
      type: "string",
    },
  });
  static prodDesc = (must = true) => ({
    amount: {
      presence: must,
      type: "number",
    },
    color: {
      presence: must,
      type: "string",
    },
    sizesId: {
      presence: must,
      type: "string",
    },
  });
  static brands = (must = true) => ({
    name: {
      presence: must,
      type: "string",
    },
    imgUrl: {
      presence: must,
      type: "string",
    },
  });
  static fee = (must = true) => ({
    fee: {
      presence: must,
      type: "number",
    },
    city: {
      presence: must,
      type: "string",
    },
  });
  static orders = (must = true) => ({
    address: {
      presence: must,
      type: "string",
    },
    status: {
      presence: must,
      type: "string",
    },
    total_cost: {
      presence: must,
      type: "number",
    },
    userId: {
      presence: must,
      type: "string",
    },
    fee_dataId: {
      presence: must,
      type: "number",
    },
  });
  static promocode = (must = true) => ({
    promoCode: {
      presence: must,
      type: "string",
    },
    count: {
      presence: must,
      type: "number",
    },
    end_at: {
      presence: must,
      type: "string",
    },
    persantage: {
      presence: must,
      type: "number",
    },
  });
}
