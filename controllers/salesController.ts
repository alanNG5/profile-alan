import { Request, Response } from "express";
import { SalesService } from "../services/salesService";
import "../utils/session";

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
      // Check if the product is still available once a purchase is triggered.
      let qtnQuery =
        await this.salesService.finalConfirmQtnAvailabilityBeforeDeal(
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

  getRecord = async (req: Request, res: Response) => {
    let userId = req.session.userid as number | undefined;
    let userRole = req.session.admin_role;

    if (userId === undefined) {
      return res
        .status(400)
        .json({ errorMessage: "Member login is required." });
    }

    if (userRole) {
      return res
        .status(403)
        .json({ errorMessage: "Access Denied: for MEMBER only." });
    }

    try {
      let record = await this.salesService.getSalesRecord(userId);
      for (let row of record) {
        row.created_at = formatDate(row.created_at);
      }
      res.status(200).json({ record });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + (error as Error).message,
      });
    }
  };
}

function formatDate (date: Date): String {
  // const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOVr","DEC"];
  let dateOfMon = ("0" + date.getDate()).slice(-2);
  let monthIndex = date.getMonth();
  let hr = ("0" + date.getHours()).slice(-2);
  let min = ("0" + date.getMinutes()).slice(-2);
  let sec = ("0" + date.getSeconds()).slice(-2);
  return `${dateOfMon} ${month[monthIndex]}, ${date.getFullYear()} ${hr}:${min}:${sec}`;
};


export { SalesController };
