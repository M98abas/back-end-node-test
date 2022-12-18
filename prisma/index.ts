import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import adminRoute from "../routes/v1/actions/admin.router";
import usersRoute from "../routes/v1/actions/users.routes";
import brandRoute from "../routes/v1/web/brands.route";
import feeRoute from "../routes/v1/web/fee.route";
import promocodeRoute from "../routes/v1/web/promoCode.routes";
import categoryRoute from "../routes/v1/web/category.route";
import orderRoute from "../routes/v1/web/order.route";
import productRoute from "../routes/v1/web/product.route";
import multer from "multer";
import morgan from "morgan";
import path from "path";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./prisma/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload: any = multer({ storage });
// init prisma client
const prisma = new PrismaClient();

async function main() {
  const app: any = express();
  const port = 4000;
  // addd cors middleware
  app.use(cors());
  // request object as json obj
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname));
  app.use(express.static(__dirname));

  // Admin Routes
  app.use("/admin", adminRoute);

  // User Routes
  app.use("/user", usersRoute);

  // Brands Routes
  app.use("/brands", brandRoute);

  // Brands Routes
  app.use("/fee", feeRoute);

  // Brands Routes
  app.use("/promocode", promocodeRoute);

  // Brands Routes
  app.use("/order", orderRoute);

  // Brands Routes
  app.use("/product", productRoute);

  // Category Routes
  app.use("/category", categoryRoute);

  app.post("/upload_files", upload.single("files"), uploadFiles);

  function uploadFiles(req: any, res: any) {
    // console.log(req.body);
    const host = req.host;
    const filePath = `${req.protocol}://${host}:${port}/uploads/${req.file.originalname}`;
    res.json({ URL: filePath });
  }
  app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
