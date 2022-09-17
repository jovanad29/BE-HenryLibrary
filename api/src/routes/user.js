//definir la ruta de la api hacia el controlador de user
const { Router } = require("express");
const router = Router();
const {
    getAll,
    getById,
    getUserByName,
    createUser,
    updateAdminUser,
    logicaldeleteUser,
    bannedUser,
    addFavorite,
    deleteFavorite,
    getUserFavorites,
    getUserPaymentsBook,
    updateUserAddress,
    updateUserName,
} = require("../controllers/users");

router.get("/", getAll);
router.get("/byname", getUserByName);
router.get("/:uid", getById);

router.get("/", getUserByName);
router.post("/", createUser);
router.post("/:uid/favorites/:bid", addFavorite);
router.delete("/:uid/favorites/:bid", deleteFavorite);
router.get("/:uid/favorites", getUserFavorites);
router.put("/:uid", updateAdminUser);

router.delete("/:uid", logicaldeleteUser);
router.delete("/banned/:uid", bannedUser);

router.get("/bookpayments/:uid", getUserPaymentsBook);
router.put("/address/:uid", updateUserAddress);
router.put("/name/:uid", updateUserName);

module.exports = router;
