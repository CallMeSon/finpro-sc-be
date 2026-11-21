import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketControllers.js";

const router = express.Router();

// /api/tickets
router.route("/").post(createTicket).get(getAllTickets);

// /api/tickets/:id
router.route("/:id").get(getTicketById).put(updateTicket).delete(deleteTicket);

export default router;
