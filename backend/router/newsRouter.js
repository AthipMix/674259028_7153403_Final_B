import express from "express";

import {
  createNew,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controller/newsController.js";

const router = express.Router();

router.post("/", createNew);
router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;
