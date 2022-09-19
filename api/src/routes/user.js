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
    getPaymentMPUserAllAdresses
} = require("../controllers/users");

router.get("/", getAll);
router.get("/byname", getUserByName);
router.get("/:uid", getById);
router.get("/:uid/adresses", async (req, res) => {
    const { uid } = req.params;
    try {
      const addresses = await getPaymentMPUserAllAdresses(uid);
  
      addresses
        ? res.json(addresses)
        : res.status(404).json({ message: `No hay direcciones` });
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Cannot get addresses" });
    }
});

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
