import Chapter from '../models/Chapter.js';

// Fungsi untuk menampilkan story berdasarkan ID
export const getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findByPk(req.params.id, {
            attributes: ['chapter_title', 'story_chapter', 'updatedAt']
        });
        if (chapter) {
            res.json(chapter);
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menambah story
export const createChapter = async (req, res) => {
    try {
        const { chapter_title, story_chapter } = req.body;

        const newChapter = await Chapter.create({
            chapter_title,
            story_chapter
        });
        res.status(201).json({ message: 'Chapter created successfully', chapter: newChapter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk update story
export const updateChapter = async (req, res) => {
    const { id } = req.params;
    const { chapter_title, story_chapter } = req.body;
    try {
        //Mencari chapter berdasarkan ID
        const chapter = await Chapter.findByPk(id);

        if(chapter) {
            // Mengupdate data chapter
            chapter.chapter_title = chapter_title || chapter.chapter_title;
            chapter.story_chapter = story_chapter || chapter.story_chapter;
            // Menyimpan perubahan ke database
            await chapter.save();

            res.json({ message: 'Chapter updated successfully', chapter });
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus story
export const deleteChapter = async (req, res) => {
    const { id } = req.params;
    try {
        const chapter = await Chapter.findByPk(id);
        if (chapter) {
            // Menghapus chapter
            await chapter.destroy();
            res.json({ message: 'Chapter deleted successfully' });
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

