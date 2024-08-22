import Category from "../models/Category.js";

export const getCategory = async (req, res) => {
    try {
        const category = await Category.findAll();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}