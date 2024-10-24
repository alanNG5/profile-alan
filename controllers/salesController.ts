import { Request, Response } from "express";
import { SalesService } from "../services/salesService";

class SalesController {
  constructor(private salesService: SalesService) {}

  createOrder = async (req: Request, res: Response) => {
    let {
      pid,
      accountId,
      current_price,
      recipient,
      contact_no,
      shipping_address,
      payment_method,
    } = req.body;

    // Validate and parse integers
    // const parsedPid = parseInt(pid);
    // const parsedAccountId = parseInt(accountId);
    // const parsedPrice = parseInt(current_price);

    try {
      let newOrder = await this.salesService.insertSales(
        parseInt(pid),
        parseInt(accountId),
        parseInt(current_price),
        recipient,
        contact_no,
        shipping_address,
        payment_method
      );
      if (newOrder) {
        res.status(201).json({
          success: newOrder.message,
        });
      } else {
        res.status(500).json({
          errorMessage: "Failed to create new order",
        });
      }
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };
}

export { SalesController };
