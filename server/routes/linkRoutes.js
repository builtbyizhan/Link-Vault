import express from "express";
import { getLinks, addLink, deleteLink, togglePin } from "../controllers/linkController.js";

const router = express.Router();

router.get("/", getLinks);
router.post("/", addLink);
router.delete("/:id", deleteLink);
router.patch("/:id/pin", togglePin);

export default router;