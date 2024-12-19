import { Request, Response } from "express";
import { ProductsService } from "../services/productsService";
import { formidable, File } from "formidable";
// import fs from "fs";
import { promises as fs } from "fs";
import "../utils/session";

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
        return res.status(404).json({ error: "Product not found." });
      }
      //
      // @ client side can access boolean of stock instead of exact quantity, except for admin
      product[0].outOfStock = product[0].stock_qtn < 1 ? true : false;
      if (!req.session.admin_role) {
        delete product[0].stock_qtn;
      }
      res.status(200).json({ data: product });
    } catch (error) {
      // console.log(error);
      res.status(404).json({ message: error });
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
    await fs.mkdir(uploadDir, { recursive: true });

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

    const imagePath = files.image_entry?.newFilename;
    // @ full path of the uploaded image
    // functions of fs.unlink require the complete path to the file to know where to look. Node.js cannot find and delete the file under the current working directory.
    const fullImagePath = `${uploadDir}/${files.image_entry?.newFilename}`;

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

      let createNewItem = await this.productsService.insertProduct(
        brand_entry,
        model_name_entry,
        model_no_entry,
        parseInt(formatCurrency),
        description_entry,
        parseInt(stock_qtn_entry),
        is_pre_owned_entry,
        imagePath
      );

      // @ Check if the file exists before trying to unlink it
      await fs.stat(fullImagePath);

      if (!createNewItem) {
        await fs.unlink(fullImagePath);
        res.status(500).json({
          errorMessage: "Internal server error: failure to create new item.",
        });
      } else if (!createNewItem.flag) {
        await fs.unlink(fullImagePath);
        res.status(400).json({ duplicatedItemMessage: createNewItem.message });
      } else if (createNewItem.flag) {
        res.status(201).json({ successMessage: createNewItem.message });
      }
    } catch (error) {
      try {
        // @ Checking file existence before deletion
        await fs.stat(fullImagePath);
        await fs.unlink(fullImagePath);
      } catch (unlinkError) {
        console.error(`Failed to delete file: ${unlinkError}`);
      }
      res.status(500).json({ message: "Internal server error: ", error });
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
      let { searchPrice, searchQtn, searchDesc } = req.body;

      let currentTime = new Date().toJSON();

      await this.productsService.updateProductById(
        parseInt(targetId),
        parseInt(searchPrice),
        parseInt(searchQtn),
        searchDesc,
        currentTime
      );

      res.status(200).json({
        updatedTime: currentTime,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  getInventoryLevel = async (req: Request, res: Response) => {
    try {
      let inventoryLevel = await this.productsService.selectStockQuantity();
      res.status(200).json({ inventoryLevel });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  };
}

function capitalizeFirstLetter(text: string) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export { ProductsController };
