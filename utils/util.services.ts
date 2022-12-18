/**
 *
 * @param res
 * @param err
 * @param code
 * @param key
 * @returns
 */
const errRes = (res: any, err: any, code = 400, key = "err") => {
  return res.json({ status: false, errMsg: err });
};

/**
 *
 * @param res
 * @param data
 * @param code
 * @returns
 */
const okRes = (res: any, data: any, code = 200) => {
  // Success Web Response
  let sendData = { status: true, errMsg: "" };

  if (typeof data == "object") {
    sendData = Object.assign(data, sendData); //merge the objects
  }
  if (typeof code !== "undefined") res.statusCode = code;
  return res.json(sendData);
};

/**
 *
 * @returns
 */
const getOtp = () => Math.floor(100000 + Math.random() * 900000);

export { okRes, errRes, getOtp };
