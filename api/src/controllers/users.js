const { User, Payment, Review } = require('../db');


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['nameUser', 'ASC']] });
        if (users) return res.json(users)
        return res.status(404).json({status: 404, message: 'No se encontraron usuarios  '})   
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}
exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.uid);
        if (user) return res.json(user)
        return res.status(404).json({status: 404, message: 'No se encontró el usuario con ese uid '})      
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
exports.getUsersByName = async (req, res) => {
  try {
    const { nameUser } = req.query;
    const users = await User.findAll({
      order: [["nameUser", "ASC"]],
      where: {
        title: {
          [Op.iLike]: `%${nameUser}%`,
        },
      },
      include: [{ model: Review }, { model: Payment }],
    });

    if (users) {
      return res.json(users);
    } else {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No se encontraron usuarios con ese nombre ",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//----------- POST -----------//
function validations(nameUser, email) {
  if (nameUser && (nameUser.length < 2 || nameUser.length > 100)) return false;

  const patternEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  if (!email || email === undefined || !patternEmail.test(email)) return false;

  return true;
}

exports.createUser = async (req, res) => {
  const { uid, nameUser, email, profilePic } = req.body;
  try {
    // if (!validations(nameUser, email))
    // return res.status(400).json({status: 400, message: 'Error con las validaciones'});

    const newUser = await User.create({ uid, nameUser, email, profilePic });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// //----------- PUT -----------//  nameUser, mail,uid? 
// exports.updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body;
//     try {
//         let dbCategory = await Category.findByPk(id);
//         if (dbCategory) {
//             dbCategory.name = name;
//             await dbCategory.save();
//         }
//         return res.status(204).json({})        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }

// //----------- DELETE -----------//  isActive=false
// exports.deleteUser = async (req, res) => {
//     const { id } = req.params;
//     try {
//         let user = await Category.findByPk(id);
//         if user {
//             dbCategory.isActive = dbCategory.isActive ? false : true;
//             await dbCategory.save();
//         }
//         return res.status(204).json({})        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }
// //----------- DELETE -----------//  isBanner=true
// exports.deleteUser = async (req, res) => {
//     const { id } = req.params;
//     try {
//         let user = await Category.findByPk(id);
//         if user {
//             dbCategory.isActive = dbCategory.isActive ? false : true;
//             await dbCategory.save();
//         }
//         return res.status(204).json({})        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }
