import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder
} from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
