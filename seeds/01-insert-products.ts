import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // clear data from all tables. Those with foreign keys should be handled first.
  await knex("sales").del();
  await knex.raw("ALTER SEQUENCE sales_id_seq RESTART WITH 101");
  await knex("product_images").del();
  await knex.raw("ALTER SEQUENCE product_images_id_seq RESTART WITH 1");
  await knex("products").del();
  await knex.raw("ALTER SEQUENCE products_id_seq RESTART WITH 1");
  await knex("users").del();
  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  const [{ id }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Seiko",
      model_name: "Presage",
      model_no: "SPB463",
      current_price: 7580,
      description: "",
      stock_qtn: 10,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id,
      image_path: "3a79c05bd2cd21c7e5278dc00.png",
    })
    .into("product_images");

  const [{ id: id2 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Seiko",
      model_name: "Lukia",
      model_no: "SSVW154",
      current_price: 5200,
      description: "",
      stock_qtn: 20,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id2,
      image_path: "3a79c05bd2cd21c7e5278dc01.png",
    })
    .into("product_images");

  const [{ id: id3 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Certina",
      model_name: "DS Action Powermatic 80",
      model_no: "C032.607.11.051.00",
      current_price: 8650,
      description: "Automatic, black, 316L stainless steel, 43mm",
      stock_qtn: 25,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id3,
      image_path: "3a79c05bd2cd21c7e5278dc02.webp",
    })
    .into("product_images");

  const [{ id: id4 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Rolex",
      model_name: "Daytona",
      model_no: "116500LN-0001",
      current_price: 115500,
      description:
        "Automatic, grey, stainless steel, 40mm, anti-reflective, scratch resistant, sapphire",
      stock_qtn: 2,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id4,
      image_path: "3a79c05bd2cd21c7e5278dc03.webp",
    })
    .into("product_images");

  const [{ id: id5 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Rolex",
      model_name: "Air-king",
      model_no: "116900",
      current_price: 73000,
      description: "Automatic, black, stainless steel, 40mm",
      stock_qtn: 15,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id5,
      image_path: "e85189d9095b3a5beccca4300.png",
    })
    .into("product_images");

  const [{ id: id6 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Rolex",
      model_name: "DAYTONA",
      model_no: "116520-SPIKE-LEE",
      current_price: 925000,
      description:
        "Automatic, grey, stainless steel, 40mm, anti-reflective, scratch resistant, sapphire",
      stock_qtn: 1,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id6,
      image_path: "ea7c0cadf19494830d07c5601.webp",
    })
    .into("product_images");

  const [{ id: id7 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Tudor",
      model_name: "1926",
      model_no: "M91451-0001",
      current_price: 25800,
      description: "Automatic, stainless steel, 36mm, sapphire crystal",
      stock_qtn: 6,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id7,
      image_path: "ae5c3e2cb61cb41d88998eb01.png",
    })
    .into("product_images");

  const [{ id: id8 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Tudor",
      model_name: "Black Bay Ceramic",
      model_no: "M79210CNU-0007",
      current_price: 40000,
      description: "Matt black ceramic, 41mm, domed sapphire crystal",
      stock_qtn: 8,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id8,
      image_path: "551e17b1f56e50f2f7ce9ac00.png",
    })
    .into("product_images");

  const [{ id: id9 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Tudor",
      model_name: "Royal",
      model_no: "M28603-0001",
      current_price: 30400,
      description: "Stainless steel, 41mm, sapphire crystal",
      stock_qtn: 15,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  await knex
    .insert({
      product_id: id9,
      image_path: "551e17b1f56e50f2f7ce9ac01.webp",
    })
    .into("product_images");

  const [{ id: id10 }]: Array<{ id: number }> = await knex
    .insert({
      brand: "Omega",
      model_name: "Seamaster Aqua Terra",
      model_no: "220.50.41.21.10.001",
      current_price: 365500,
      description:
        "18k Moonshine gold case, 41mm x 13.4mm, 150m water-resistance, sapphire crystal on both sides, gold bracelet",
      stock_qtn: 3,
      is_pre_owned: false,
    })
    .into("products")
    .returning("id");

  return await knex
    .insert({
      product_id: id10,
      image_path: "62cb3d140a5f192a3f6888500.webp",
    })
    .into("product_images");
}
