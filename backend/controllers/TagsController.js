import Tags from "../models/Tags.js";

export const getTags = async (req, res) => {
    try {
        const tags = await Tags.findAll();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}