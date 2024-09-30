import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // await knex("sales").del();
  // await knex.raw("ALTER SEQUENCE sales_id_seq RESTART WITH 101");

  await knex("sales").insert({
    product_id: 2,
    user_id: 3,
    selling_price: 5200,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 9,
    user_id: 2,
    selling_price: 30400,
    recipient: "Mr So",
    contact_no: "26899000",
    shipping_address: "Room 14, 2/F, Alice Nethersole Building, N.T.",
    payment_method: "paypal",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 8,
    user_id: 2,
    selling_price: 40000,
    recipient: "Mr So",
    contact_no: "26899000",
    shipping_address: "Room 14, 2/F, Alice Nethersole Building, N.T.",
    payment_method: "visa",
    order_status: "shipment_arranging",
  });

  await knex("sales").insert({
    product_id: 8,
    user_id: 3,
    selling_price: 40000,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 5,
    user_id: 3,
    selling_price: 73000,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 3,
    user_id: 3,
    selling_price: 8650,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "shipment_arranging",
  });
}
