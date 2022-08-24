//definir la ruta de la api hacia el controlador de categorias
const { Router } = require("express");
const router = Router();
const {
    getAll,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categories");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        let dbCategory = await getById(id);
        dbCategory
            ? res.json(dbCategory)
            : res.status(404).json({ message: "No se encontro la categoria" });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});

router.get("/", async (req, res) => {
    try {
        let dbCategories = await getAll();
        dbCategories
            ? res.json(dbCategories)
            : res.status(404).json({ message: "No se encontraron categorias" });
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
});
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

//exportar el router para poder usarlo en el index.js
module.exports = router;
