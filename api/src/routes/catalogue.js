//definir la ruta de la api hacia el controlador de catalogo
const { Router } = require("express");
const router = Router();
const {
  getAll,
  getBook,
  getById,
  createBook,
  updateBook,
  logicalDeleteBook,
  getBookQty,
  getBooksCategoryAuthor, //<--
  getAllReviewsByBook,
  cloudinary
} = require("../controllers/catalogue");

router.get("/", async (req, res) => {
  const { title } = req.query;
  const { pagina = 0, items = 10 } = req.query;
  try {
    if (title) {
      let book = await getBook(title, pagina, items);
      book.length
        ? res.status(200).json(book)
        : res.json({ status: 404, message: "No se encontró el libro" });
    } else {
      let dbBooks = await getAll(pagina, items);
      dbBooks.length
        ? res.json(dbBooks)
        : res.json({ status: 404, message: "No se encontraron libros" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.get("/filter/", getBooksCategoryAuthor); //<--

router.get("/:id", getById);

router.get("/count/:true", getBookQty);

router.post("/", createBook);

router.post("/upload/", cloudinary);

router.put("/:id", updateBook);

router.delete("/:id", logicalDeleteBook);

router.get('/:id/reviews', getAllReviewsByBook);

//exportar el router para poder usarlo en el index.js
module.exports = router;
