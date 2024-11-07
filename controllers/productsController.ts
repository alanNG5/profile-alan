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
      res.status(500).json({ message: "Internal server error." });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      let targetId = req.params["productId"];
      let product = await this.productsService.selectProductById(
        parseInt(targetId)
      );

      if (!product) {
        // Setting headers to prevent caching:
        // res.setHeader(
        //   "Cache-Control",
        //   "no-store, no-cache, must-revalidate, private"
        // );

        return res.status(404).json({ error: "Product not found." });
        // return res.status(404).redirect("/404.html");
        // res.write("location.href = '/404.html'");
      }

      // checking stock quantity but not returning the number to client side
      product[0].outOfStock = product[0].stock_qtn < 1 ? true : false;
      delete product[0].stock_qtn;

      res.status(200).json({ data: product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  getNewProducts = async (req: Request, res: Response) => {
    try {
      let newProducts = await this.productsService.selectNewProducts();
      res.status(200).json({ data: newProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  getBestSellingProducts = async (req: Request, res: Response) => {
    try {
      let bestSellingProducts =
        await this.productsService.selectBestSellingProducts();
      res.status(200).json({ data: bestSellingProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
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
      let formatCurrency = current_price_entry.replace(/[^0-9.]+/g, "");

      await this.productsService.insertProduct(
        brand_entry,
        model_name_entry,
        model_no_entry,
        parseInt(formatCurrency),
        description_entry,
        parseInt(stock_qtn_entry),
        is_pre_owned_entry,
        imagePath
      );
      res.status(201).json({ message: "success" });
    } catch (error) {
      console.log("Error occurred during inserting new item: ", error);
      res
        .status(500)
        .json({ message: "Internal server error: failed to insert new item." });
    }
  };

  getBrands = async (req: Request, res: Response) => {
    try {
      let brandList = await this.productsService.selectBrands();
      res.status(200).json({ brandList });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  getModelNames = async (req: Request, res: Response) => {
    try {
      let targetBrand = capitalizeFirstLetter(req.params.selectedBrand);
      let modelList = await this.productsService.selectModelNames(targetBrand);
      res.status(200).json({ modelList });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateProductById = async (req: Request, res: Response) => {
    try {
      let targetId = req.params["productId"];
      let product = await this.productsService.selectProductById(
        parseInt(targetId)
      );

      if (!product) {
        return res.status(404).json({ searchError: "Product not found." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
}

function capitalizeFirstLetter(text: string) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export { ProductsController };
