import express from "express";
import Knex from "knex";
import { ProductsController } from "./controllers/productsController";
import { ProductsService } from "./services/productsService";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";

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

routes.post("/admin/newItem", productsController.createProduct);

const authService = new AuthService(knex);
const authController = new AuthController(authService);

routes.post("/user/login", authController.login);
routes.post("/user/logout", authController.logout);
routes.get("/user", authController.checkVisitorStatus);