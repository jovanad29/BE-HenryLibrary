//definir la ruta de la api hacia el controlador de autores
const { Router } = require("express");
const router = Router();
const {
    getAll,
    getByName,
    getById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} = require("../controllers/authors");

router.get("/:id", getById);

router.get("/", async (req, res) => {
    const { name } = req.query;
    try {
        if (name) {
            let author = await getByName(name);
            author
                ? res.status(200).json(author)
                : res.status(501).json({ message: "No se encontro el autor" });
        } else {
            let dbAuthors = await getAll();
            dbAuthors
                ? res.json(dbAuthors)
                : res.status(501).json({ message: "No se encontraron autores" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

//exportar el router para poder usarlo en el index.js
module.exports = router;
