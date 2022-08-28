//definir la ruta de la api hacia el controlador de catalogo
const { Router } = require("express");
const { cls } = require("sequelize");
const router = Router();
const {
    getAll,
    getBook,
    getById,
    createBook,
    modifyBook,
    getBookByAuthor,
    getBookByCategory,
    logicalDeleteBook,
    bannedBook,
    getCountBooks,
} = require("../controllers/catalog");

router.get("/:id", async (req, res) => {
    const book = await getById(req.params.id);
    try {
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(501).json({ message: "No se encontro el libro" });
        }
    } catch (error) {
        res.status(502).json(error);
    }
});

router.get("/", async (req, res) => {
    const { title } = req.query;
    const { pagina = 0, items = 10 } = req.query;
    try {
        if (title) {
            let book = await getBook(title, pagina, items);
            book
                ? res.status(200).json(book)
                : res.status(501).json({ message: "No se encontro el libro" });
        } else {
            let dbBooks = await getAll(pagina, items);
            dbBooks
                ? res.json(dbBooks)
                : res.status(501).json({ message: "No se encontraron libros" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//filter by author
router.get("/author/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            let book = await getBookByAuthor(id);
            book
                ? res.status(200).json(book)
                : res.status(501).json({
                      message: "No se encontraron libros para ese author",
                  });
        } else {
            let dbBooks = await getAll();
            dbBooks
                ? res.json(dbBooks)
                : res.status(404).json({ message: "No se encontraron libros" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//count all books
router.get("/contar/:id", async (req, res) => {
    try {
        let countBooks = await getCountBooks();
        countBooks
            ? res.json(countBooks)
            : res.status(404).json({ message: "No se pudieron contar los libros" });
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//filter by category
router.get("/category/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            let book = await getBookByCategory(id);
            book
                ? res.status(200).json(book)
                : res.status(501).json({
                      message: "No se encontraron libros para ese género",
                  });
        } else {
            let dbBooks = await getAll();
            dbBooks
                ? res.json(dbBooks)
                : res.status(404).json({ message: "No se encontraron libros" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//create book
router.post("/", async (req, res) => {
    try {
        const newBook = await createBook(req.body);
        console.log(newBook);

        newBook
            ? res.status(201).json(newBook)
            : res.status(400).json({ message: `Error creando  el libro` });
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

// Update book
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            //const validate = await validateBook(req.body);
            // if (!validate) {
            const modified = await modifyBook(req.body, id);
            modified
                ? res
                      .status(200)
                      .json({ message: "Se modifico el libro existosamente" })
                : res
                      .status(400)
                      .json({ message: `Error modificandno el libro` });
            // } //else {
            //res.status(400).json(validate);
            // }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
});

//logical delete

router.put("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            let book = await logicalDeleteBook(id);
            book
                ? res.status(200).json(book)
                : res
                      .status(404)
                      .json({ message: "No se encontro el libro a eliminar" });
        } else {
            let dbBooks = await getAll();
            dbBooks
                ? res.json(dbBooks)
                : res
                      .status(501)
                      .json({ message: "No se ingreso el id para eliminar" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//banned book
router.put("/banned/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            let book = await bannedBook(id);
            book
                ? res.status(200).json(book)
                : res.status(404).json({
                      message: "No se encontro el libro a dehabilitar",
                  });
        } else {
            let dbBooks = await getAll();
            dbBooks
                ? res.json(dbBooks)
                : res
                      .status(501)
                      .json({ message: "No se ingreso el id para eliminar" });
        }
    } catch (err) {
        console.log(err);
        res.status(502).json(err);
    }
});

//exportar el router para poder usarlo en el index.js
module.exports = router;
