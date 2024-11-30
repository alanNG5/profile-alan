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

      // if (!record) {
      //   return res.json({ record: [] });
      // }

      // @ Date format check: time brough from databse is in UTC format with time zone +00:00. Adjustment to local time zone will be proceeded in the front-end.

      // for (let row of record!) {
      //   console.log("Sales No. ", row.id, " was created at ", row.created_at);
      // }

      res.status(200).json({ record });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + (error as Error).message,
      });
    }
  };

  getAllSales = async (req: Request, res: Response) => {
    try {
      let salesList = await this.salesService.selectAllSales();
      res.status(200).json({ salesList });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };

  getSalesById = async (req: Request, res: Response) => {
    try {
      let targetId = req.params["salesId"];
      let sales = await this.salesService.selectSalesInfoById(
        parseInt(targetId)
      );
      res.status(200).json({ sales });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };

  updateDeliveryStatus = async (req: Request, res: Response) => {
    try {
      let { salesOrderChecked } = req.body;

      let currentTime = new Date().toJSON();

      await this.salesService.patchDeliveryStatus(
        salesOrderChecked,
        currentTime
      );

      res.status(200).json({
        updatedSalesDeliveryStatus: salesOrderChecked.join(" , #"),
        updatedTime: currentTime,
      });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };

  getDeliveryStatusReport = async (req: Request, res: Response) => {
    try {
      let collectionStatus = await this.salesService.getDeliveryStatusStats();
      res.status(200).json({ collectionStatus });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Internal server error: " + error,
      });
    }
  };
}

export { SalesController };
