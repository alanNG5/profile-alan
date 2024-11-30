import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("sales").insert({
    product_id: 2,
    user_id: 101,
    selling_price: 5200,
    recipient: "Mr Ng",
    contact_no: "88886666",
    shipping_address: "Room B, 16/F, SOGO Building, Hong Kong Island",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 2,
    user_id: 103,
    selling_price: 5200,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 9,
    user_id: 102,
    selling_price: 30400,
    recipient: "Mr So",
    contact_no: "26899000",
    shipping_address: "Room 14, 2/F, Alice Nethersole Building, N.T.",
    payment_method: "paypal",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 8,
    user_id: 102,
    selling_price: 40000,
    recipient: "Mr So",
    contact_no: "26899000",
    shipping_address: "Room 14, 2/F, Alice Nethersole Building, N.T.",
    payment_method: "visa",
    order_status: "shipment_arranging",
  });

  await knex("sales").insert({
    product_id: 8,
    user_id: 103,
    selling_price: 40000,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 5,
    user_id: 103,
    selling_price: 73000,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "delivered",
  });

  await knex("sales").insert({
    product_id: 3,
    user_id: 103,
    selling_price: 8650,
    recipient: "Mrs Pang",
    contact_no: "50015028",
    shipping_address: "Room A, 28/F, International Tower, Kowloon",
    payment_method: "visa",
    order_status: "shipment_arranging",
  });
}
