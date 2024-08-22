import Status from "../models/Status.js";

export const getStatus = async (req, res) => {
    try {
        const status = await Status.findAll();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}