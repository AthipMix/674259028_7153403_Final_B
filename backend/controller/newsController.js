import { Op } from "sequelize";
import New from "../model/newsModel.js";

// Create news
const createNew = async (req, res, next) => {
  try {
    const { title, operations, description, category, date, status } = req.body;

    if (!title || !operations || !category || !date || status === undefined) {
      return res.status(400).json({
        message:
          "Title, operations, category, date and status are required fields",
      });
    }

    const newNews = await New.create({
      title,
      operations,
      description,
      category,
      date,
      status,
    });

    return res.status(201).json(newNews);
  } catch (error) {
    return next(error);
  }
};

// Get all news (รองรับค้นหาด้วย search และกรองด้วย category ผ่าน Query Parameters)
const getAllNews = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search && search.trim()) {
      const keyword = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: keyword } },
        { operations: { [Op.iLike]: keyword } },
        { description: { [Op.iLike]: keyword } },
      ];
    }

    if (category && category.trim()) {
      where.category = category.trim();
    }

    const news = await New.findAll({
      where,
      order: [["date", "DESC"], ["id", "DESC"]],
    });

    return res.status(200).json(news);
  } catch (error) {
    return next(error);
  }
};

// Get news by ID
const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "News ID is required",
      });
    }

    const news = await New.findByPk(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    return res.status(200).json(news);
  } catch (error) {
    return next(error);
  }
};

// Update news
const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "News ID is required",
      });
    }

    const news = await New.findByPk(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    const { title, operations, description, category, date, status } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (operations !== undefined) updates.operations = operations;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = date;
    if (status !== undefined) updates.status = status;

    await news.update(updates);

    return res.status(200).json({
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete news
const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "News ID is required",
      });
    }

    const news = await New.findByPk(id);

    if (!news) {
      return res.status(404).json({
        message: "News not found",
      });
    }

    await news.destroy();

    return res.status(200).json({
      message: "News deleted successfully",
      deletedNews: news,
    });
  } catch (error) {
    return next(error);
  }
};

export { createNew, getAllNews, getNewsById, updateNews, deleteNews };
