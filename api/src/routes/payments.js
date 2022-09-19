//definir la ruta de la api hacia el controlador de payment
const { Router } = require("express");
const router = Router();
// requerir los metodos del controlador de payment
const {
    getPaymentPaymentBook,
    getAllByUserId,
    getCountPaymentBook,
    postByUserId,
    putAllByUserId,
    putAllById,
    postPaymentPaymentBook,
    putPaymentPaymentBook,
    putAddItemToPaymentBook,
    getAllPaymentPaymentBook,
    putUpdateStatus,
    getPaymentBookById,
    getAllPaymentBookByStatus,
    getAllPaymentStadistics,
} = require("../controllers/payments");

// definir los metodos de la ruta de la api hacia el controlador de payment
router.get("/:userUid", getPaymentPaymentBook); //carrito activo de un usuario
router.get("/count/:userUid", getCountPaymentBook); //cantidad de items totales en el carrito activo de un usuario
router.get("/detail/:paymentId", getPaymentBookById); //carrito detallado by paymentId
// router.get('/allCount/:userUid', getCantItemsByCart);//cantidad de items por carrito de un usuario')

router.get("/all/:userUid", getAllByUserId); //todos los carritos de un usuario
router.get("/", getAllPaymentPaymentBook); //todos los carritos
router.get("/status/:statusId", getAllPaymentBookByStatus); //todos los carritos por statusId

router.post("/:userUid", postByUserId); //crear un carrito por primera vez, controla que no haya un carrito activo para el mismo usuario
router.put("/id/:id", putAllById); //edita los atributos enviados por body de un carrito por id, solo la cabecera.
router.put("/:userUid", putAllByUserId); //Actualizacion de la cabecera con todos sus datos OJO ACTUALIZA TODOS LOS REGISTROS de un userUid

router.post("/mergecart/:userUid", postPaymentPaymentBook); //Merge del carrito GUEST y el registrado en la BD al momento de loguearse
router.put("/update/:userUid", putPaymentPaymentBook); //Actualiza la cantidad de un item en el carrito y calcula el totalAmount del carrito
router.put("/addItem/:userUid", putAddItemToPaymentBook); //Agrega un item al carrito y calcula el totaAmount del carrito
router.put("/:paymentId/status/:statusId", putUpdateStatus); //Edita el estado de un carrito por paymentid

router.get("/statistics/all", getAllPaymentStadistics); //totales de ordenes por estados

//exportar el router para poder usarlo en el index.js
module.exports = router;
