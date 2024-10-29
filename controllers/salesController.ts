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

    try {
      // Check if the product is still available
      let qtnQuery = await this.salesService.checkQtnAvailability(
        parseInt(pid)
      );

      if (qtnQuery![0].stock_qtn < 1) {
        res.json({
          outOfStockMessage: true,
        });
        return;
      } else {
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
            outOfStockMessage: false,
            success: newOrder.message,
          });
        } else {
          res.status(500).json({
            errorMessage: "Failed to create new order.",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };
}

export { SalesController };
