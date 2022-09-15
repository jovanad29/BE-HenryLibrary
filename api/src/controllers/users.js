const {
    User,
    Payment,
    Review,
    Book,
    Payment_mp,
    Payment_mp_book,
} = require("../db");
const { Op } = require("sequelize");
const { getTemplate, sendEmail } = require("../config/nodemailer.config");

//----------- GET -----------//
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [["nameUser", "ASC"]] });
        if (users) return res.json(users);
        return res
            .status(404)
            .json({ status: 404, message: "No se encontraron usuarios  " });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.uid);
        if (user) return res.json(user);
        return res
            .status(404)
            .json({
                status: 404,
                message: "No se encontró el usuario con ese uid ",
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getUserByName = async (req, res) => {
    try {
        const { nameUser } = req.query;

        const users = await User.findAll({
            order: [["nameUser", "ASC"]],
            where: {
                nameUser: {
                    [Op.iLike]: `%${nameUser}%`, //.toLowerCase(), el iLike ignora si son mayúsculas o minúsculas
                },
            },
            include: [{ model: Review }, { model: Payment }],
        });

        if (users) {
            return res.json(users);
        } else {
            return res.status(404).json({
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
    if (nameUser && (nameUser.length < 2 || nameUser.length > 100))
        return false;

    const patternEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    if (!email || email === undefined || !patternEmail.test(email))
        return false;

    return true;
}

exports.createUser = async (req, res) => {
    const { uid, nameUser, email, profilePic } = req.body;
    try {
        // if (!validations(nameUser, email))
        // return res.status(400).json({status: 400, message: 'Error con las validaciones'});
        const userExist = await User.findByPk(uid);

        await User.findOrCreate({
            where: { uid: uid },
            defaults: { nameUser, email, profilePic },
        });
        const userCreated = await User.findByPk(uid);
        if (userCreated) {
            userCreated.nameUser = nameUser;
            await userCreated.save();
            if (!userExist) {
                // console.log("entra");
                // aquí se ejecuta el método para enviar el correo
                const html = getTemplate(
                    "bienvenida",
                    userCreated.dataValues.nameUser
                );
                await sendEmail(
                    userCreated.dataValues.email,
                    "¡Bienvenido/a a Librería Henry!",
                    html
                );
            }
        }
        return res.status(201).json(userCreated);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// //----------- PUT -----------//
exports.updateAdminUser = async (req, res) => {
    const { uid } = req.params;
    console.log(uid);
    try {
        let user = await User.findByPk(uid);
        if (user) {
            user.isAdmin = user.isAdmin ? false : true;
            await user.save();
        }
        return res.status(204).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

//----------- DELETE -----------//  isActive=false
exports.logicaldeleteUser = async (req, res) => {
    const { uid } = req.params;
    try {
        let user = await User.findByPk(uid);
        if (user) {
            user.isActive = user.isActive ? false : true;
            await user.save();
        }
        return res.status(204).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
//----------- BANNED -----------//  isBanned=true
exports.bannedUser = async (req, res) => {
    const { uid } = req.params;
    try {
        let user = await User.findByPk(uid);
        if (user) {
            user.isBanned = user.isBanned ? false : true;
            await user.save();
        }
        return res.status(204).json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.addFavorite = async (req, res) => {
    const { uid, bid } = req.params;
    try {
        const user = await User.findByPk(uid);
        const book = await Book.findByPk(bid);
        await user.addBook(book);
        const result = await User.findOne({
            where: {
                uid,
            },
            include: {
                model: Book,
                where: {
                    id: bid,
                },
            },
        });
        console.log(result);
        return res.status(201).json(result); // revisar
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 500, message: "Error al agregar favorito" });
    }
};

exports.deleteFavorite = async (req, res) => {
    const { uid, bid } = req.params;
    try {
        const user = await User.findByPk(uid);
        const book = await Book.findByPk(bid);
        await user.removeBook(book);
        return res.status(204).json({}); // revisar
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 500, message: "Error al eliminar favorito" });
    }
};

exports.getUserFavorites = async (req, res) => {
    const { uid } = req.params;
    try {
        const userFavorites = await User.findByPk(uid, {
            include: {
                model: Book,
            },
        });
        if (userFavorites) {
            return res.json(userFavorites.books);
        }
        return res.status(404).json([]);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.getUserPaymentsBook = async (req, res) => {
    const { uid } = req.params; //id usuario
    const { id } = req.query; //id libro

    console.log(id);
    console.log(uid);

    try {
        const userBooks = await Payment_mp.findOne({
            where: {
                userId: uid,
            },

            include: {
                model: Book,
                where: {
                    id: id,
                },
            },
        });
        if (userBooks?.books) {
            return res.json({ quantityBooks: userBooks.books.length });
        }
        return res.json({ quantityBooks: 0 });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
