//definir la ruta de la api hacia el controlador de user
const { Router } = require('express');
const router = Router();
const {
  getAll,
  getById,
  getUserByName,
  createUser,
  updateAdminUser,
  logicaldeleteUser,
  bannedUser,
  addFavorites
} = require('../controllers/users');

router.get('/', getAll);
router.get('/byname', getUserByName);
router.get('/:uid', getById);

router.get('/', getUserByName);
router.post('/', createUser);
router.post('/:uid/favorites/:bid',addFavorites)
router.put('/:uid', updateAdminUser);

router.delete('/:uid', logicaldeleteUser);
router.delete('/banned/:uid', bannedUser);

module.exports = router;
