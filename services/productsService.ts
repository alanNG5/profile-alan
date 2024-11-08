import { Knex } from "knex";

export class ProductsService {
  constructor(private knex: Knex) {}

  async selectAllProducts() {
    return await this.knex
      .select(
        "products.id",
        "brand",
        "model_name",
        "model_no",
        "current_price",
        "image_path"
      )
      .from("products")
      .innerJoin("product_images", "products.id", "product_images.product_id")
      .where("products.stock_qtn", ">", 0)
      .orderBy("products.brand");
  }

  async selectProductById(productId: number) {
    return await this.knex
      .select(
        "products.id",
        "brand",
        "model_name",
        "model_no",
        "current_price",
        "description",
        "stock_qtn",
        "image_path"
      )
      .from("products")
      .innerJoin("product_images", "products.id", "product_images.product_id")
      .where("products.id", productId);
  }

  async selectNewProducts() {
    return await this.knex
      .select("products.id", "brand", "model_name", "image_path")
      .from("products")
      .innerJoin("product_images", "products.id", "product_images.product_id")
      .orderBy("products.created_at", "DESC")
      .limit(7);
  }

  async selectBestSellingProducts() {
    let data = await this.knex.raw(
      `WITH best_sold AS (SELECT products.id, brand, model_name, image_path, COUNT(sales.id) FROM products
      INNER JOIN product_images ON products.id = product_images.product_id
      INNER JOIN Sales on products.id = sales.product_id
      GROUP BY products.id, image_path)
      SELECT id, brand, model_name, image_path FROM best_sold
      ORDER BY COUNT DESC
      LIMIT 5;`
    );
    return data.rows;
  }

  async insertProduct(
    brand_entry: string,
    model_name_entry: string,
    model_no_entry: string,
    current_price_entry: number,
    description_entry: string | null,
    stock_qtn_entry: number,
    is_pre_owned_entry: boolean,
    imagePath: string
  ) {
    try {
      const newProductData = {
        brand: brand_entry,
        model_name: model_name_entry,
        model_no: model_no_entry,
        current_price: current_price_entry,
        description: description_entry,
        stock_qtn: stock_qtn_entry,
        is_pre_owned: is_pre_owned_entry,
      };

      let newProduct = await this.knex("products")
        .insert(newProductData)
        .returning("id");

      if (imagePath) {
        let imagePathSaved = {
          product_id: newProduct[0].id,
          image_path: imagePath,
        };
        await this.knex("product_images").insert(imagePathSaved);
        console.log("Image saved. Uploading completed.");
      }
    } catch (error) {
      console.log("Uploading Error for New Item: ", error);
    }
  }

  async selectBrands() {
    return await this.knex("products").distinct("brand").orderBy("brand");
  }

  async selectModelNames(brand: string) {
    return await this.knex("products")
      .select("id", "model_name")
      .where("brand", brand)
      .orderBy("model_name");
  }

  async updateProductById(
    productId: number,
    price_update: number,
    stock_qtn_update: number,
    description_update: string
  ) {
    try {
      await this.knex("products").where("id", productId).update({
        current_price: price_update,
        stock_qtn: stock_qtn_update,
        description: description_update,
      });
    } catch (error) {
      console.log("Error occurred during updating product: ", error);
    }
  }
}
