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

router.get("/:id", getById);
router.get("/", async (req, res) => {
    try {
        let dbCategories = await getAll();
        dbCategories
            ? res.json(dbCategories)
            : res.status(404).json({ message: "No se encontraron categorias" });
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

//exportar el router para poder usarlo en el index.js
module.exports = router;
