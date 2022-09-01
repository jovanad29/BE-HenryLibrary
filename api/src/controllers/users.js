
//const { ValidationError } = require('sequelize/types');
const { User, Payment, Review } = require('../db');


//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['name', 'ASC']] });
        if (users) return res.json(users)
        return res.status(404).json({status: 404, message: 'No se encontraron usuarios  '})   
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}
exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (category) return res.json(user)
        return res.status(404).json({status: 404, message: 'No se encontró el usuario con ese id '})      
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
exports.getUsersByName = async (req, res) => {
    try {
        const { firstname } = req.query;
        const users = await User.findAll({
			order: [['lastname', 'ASC']],
			where: {
				title: {
					[Op.iLike]: `%${firstname}%`,
				},
			},
			include: [
				{ model: Review },
				{ model: Payment },
				
			],
		});
        // console.log(category)
        if (users) {
            return res.json(users);
        } else {
            return res.status(404).json({status: 404, message: 'No se encontraron usuarios con ese nombre '});
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

//----------- POST -----------//
function validations(firstname, lastname, email, password) {

  if (firstname && (firstname.length < 2 || firstname.length > 100))
    return false;

  if (lastname && (lastname.length < 2 || lastname.length > 100)) return false;

  const patternEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  if (!email || email === undefined || !patternEmail.test(email)) return false;

  if (
    !password ||
    email === undefined ||
    password.length < 4 ||
    password.length > 100
  )
    return false;

  return true;
}

exports.createUser = async (req, res) => {
    const { firtsname, lastname, email, password, profilePic, address } = req.body
    try {
        if (!validations(firtsname, lastname, email, password))
        return res.status(400).json({status: 400, message: 'Error con las validaciones'}); 
        
        const newUser = await User.create({
                                            firtsname, 
                                            lastname,
                                            email, 
                                            password,
                                            profilePic, 
                                            address });
        return res.status(201).json(newUser)        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// //----------- PUT -----------//
// exports.updateCategory = async (req, res) => {
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

// //----------- DELETE -----------//
// exports.deleteCategory = async (req, res) => {
//     const { id } = req.params;
//     try {
//         let dbCategory = await Category.findByPk(id);
//         if (dbCategory) {
//             dbCategory.isActive = dbCategory.isActive ? false : true;
//             await dbCategory.save();
//         }
//         return res.status(204).json({})        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }
