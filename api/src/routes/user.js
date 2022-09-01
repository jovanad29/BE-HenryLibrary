//definir la ruta de la api hacia el controlador de user
const { Router } = require("express");
const router = Router();
const { getAll, getById, getUsersByName, createUser } = require("../controllers/users");

router.get("/:id", getById);
router.get("/?firstname",getUsersByName)
router.get("/", getAll);
router.post("/", createUser);
// router.put('/:id', updateAuthor);
// router.delete('/:id', deleteAuthor);

module.exports = router;
