import express from "express";
import Knex from "knex";
import { ProductsController } from "./controllers/productsController";
import { ProductsService } from "./services/productsService";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";
import { SalesController } from "./controllers/salesController";
import { SalesService } from "./services/salesService";
import { requireLogin, requireAdmin } from "./utils/guard";

const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "production";
const knex = Knex(knexConfigs[configMode]);

export let routes = express.Router();

const productsService = new ProductsService(knex);
const productsController = new ProductsController(productsService);

routes.get("/watch/newArrivals", productsController.getNewProducts);
routes.get("/watch/hotProducts", productsController.getBestSellingProducts);
routes.get("/watch/:productId(\\d+)", productsController.getProductById);
routes.get("/watch", productsController.getAllProducts);

routes.get("/admin/showBrands", requireAdmin, productsController.getBrands);
routes.get(
  "/admin/showModels/:selectedBrand",
  requireAdmin,
  productsController.getModelNames
);
routes.patch(
  "/admin/setProduct/:productId(\\d+)",
  productsController.updateProductById
);
routes.post("/admin/newItem", productsController.createProduct);
routes.get(
  "/admin/inventoryLv",
  requireAdmin,
  productsController.getInventoryLevel
);

const authService = new AuthService(knex);
const authController = new AuthController(authService);

routes.post("/user/login", authController.login);
routes.post("/user/logout", authController.logout);
routes.get("/user", authController.checkVisitorStatus);
routes.post("/user/register", authController.register);

const salesService = new SalesService(knex);
const salesController = new SalesController(salesService);

routes.post("/sales/record", salesController.createOrder);
routes.get("/sales/record", salesController.getRecord);

routes.get("/admin/sales/status", requireAdmin, salesController.getAllSales);
routes.patch(
  "/admin/sales/status",
  requireAdmin,
  salesController.updateDeliveryStatus
);
routes.get(
  "/admin/sales/order/:salesId(\\d+)",
  requireAdmin,
  salesController.getSalesById
);
routes.get(
  "/admin/report/delivery",
  requireAdmin,
  salesController.getDeliveryStatusReport
);