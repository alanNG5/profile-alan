import { Request, Response } from "express";
import { ProductsService } from "../services/productsService";
import { formidable, File } from "formidable";
import fs from "fs";

class ProductsController {
  constructor(private productsService: ProductsService) {}

  getAllProducts = async (req: Request, res: Response) => {
    try {
      let productsList = await this.productsService.selectAllProducts();
      res.status(200).json({ data: productsList });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      let targetId = req.params["productId"];
      let product = await this.productsService.selectProductById(
        parseInt(targetId)
      );
      res.status(200).json({ data: product });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid product ID" });
    }
  };

  getNewProducts = async (req: Request, res: Response) => {
    try {
      let newProducts = await this.productsService.selectNewProducts();
      res.status(200).json({ data: newProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getBestSellingProducts = async (req: Request, res: Response) => {
    try {
      let bestSellingProducts =
        await this.productsService.selectBestSellingProducts();
      res.status(200).json({ data: bestSellingProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    const uploadDir = "uploads";
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 1024 ** 2,
      filter: (part) => part.mimetype?.startsWith("image/") || false,
    });

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          console.log(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    const imagePath = files.image_entry.newFilename;

    console.log("File name created:", imagePath);

    let {
      brand_entry,
      model_name_entry,
      model_no_entry,
      current_price_entry,
      description_entry,
      stock_qtn_entry,
      is_pre_owned_entry,
    } = fields;

    try {
      await this.productsService.insertProduct(
        brand_entry,
        model_name_entry,
        model_no_entry,
        parseInt(current_price_entry),
        description_entry,
        parseInt(stock_qtn_entry),
        is_pre_owned_entry,
        imagePath
      );
      res.json({ message: "success" });
    } catch (error) {
      console.log("Error occurred during inserting new item:", error);
      res
        .status(500)
        .json({ message: "Internal server error: failed to insert new item" });
    }
  };
}

export { ProductsController };
