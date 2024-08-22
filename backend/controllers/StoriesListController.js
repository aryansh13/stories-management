import StoriesList from '../models/StoriesList.js';
import Category from '../models/Category.js';
import Tags from '../models/Tags.js';
import Status from '../models/Status.js';

// Fungsi untuk menampilkan semua story
export const getStoriesList = async (req, res) => {
    try {
        const stories = await StoriesList.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['category_name'], // Mengambil hanya kolom category_name
                },
                {
                    model: Tags,
                    attributes: ['tags_name'],
                },
                {
                    model: Status,
                    attributes: ['status_name'], // Mengambil hanya kolom status_name
                }
            ],
            attributes: ['title', 'author', 'synopsis', 'story_cover'] // Kolom yang ingin Anda tampilkan dari tabel storieslist
        });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menampilkan story berdasarkan ID
export const getStoryById = async (req, res) => {
    try {
        const story = await StoriesList.findByPk(req.params.id, {
            attributes: ['title', 'author', 'synopsis', 'category_id', 'story_cover', 'tags_id', 'status_id'],
        });
        if (story) {
            res.json(story);
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menambah story
export const createStory = async (req, res) => {
    const { title, author, synopsis, category_id, tags_id, status_id, story_cover } = req.body;
  
    try {
      // Validasi field yang wajib ada
      if (!title || !author || !synopsis || !category_id || !status_id || !story_cover || !tags_id) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Buat cerita baru
      const newStory = await StoriesList.create({
        title,
        author,
        synopsis,
        category_id,
        story_cover,
        status_id,
        tags_id,
      });

      res.status(201).json({ message: "Story created successfully", story: newStory });
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "An internal server error occurred", error: error.message });
    }
};

// Fungsi untuk mengupdate story
export const updateStory = async (req, res) => {
    const { id } = req.params;
    const { title, author, synopsis, category_id, story_cover, tags_id, status_id } = req.body;

    try {
        // Mencari story berdasarkan ID
        const story = await StoriesList.findByPk(id);

        if (story) {
            // Mengupdate data story
            story.title = title || story.title;
            story.author = author || story.author;
            story.synopsis = synopsis || story.synopsis;
            story.category_id = category_id || story.category_id;
            story.story_cover = story_cover || story.story_cover;
            story.status_id = status_id || story.status_id;

            // Menyimpan perubahan ke database
            await story.save();

            // Jika tags_id adalah array, perbarui tags ke story
            if (Array.isArray(tags_id) && tags_id.length > 0) {
                // Cari tags berdasarkan ID
                const tags = await Tags.findAll({
                    where: {
                        id: tags_id
                    }
                });

                // Set ulang tags untuk story
                await story.setTags(tags);
            }

            res.json({ message: 'Story updated successfully', story });
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fungsi untuk menghapus story
export const deleteStory = async (req, res) => {
    const { id } = req.params; // Mengambil ID dari parameter

    try {
        // Mencari story berdasarkan ID
        const story = await StoriesList.findByPk(id);

        if (story) {
            // Menghapus story 
            await story.destroy();
            res.json({ message: 'Story deleted successfully' });
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}