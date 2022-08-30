
const { Category, Book, Author, Publisher } = require('../db');


//----------- GET -----------//
exports.getAll = async function() {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        return categories
    } catch (error) {
        console.log(error)
        return undefined
    }
};
exports.getById = async function (req, res) {
    try {
        const category = await Category.findByPk(req.params.id);
        return category;        
    } catch (error) {
        console.log(error)
        return undefined
    }
};
exports.getBooksByCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include : {
                model: Book,
                include: [Author, Publisher]
            }
        });
        console.log(category)
        if (category) {
            return res.json(category);
        } else {
            return res.status(404).json({status: 404, message: 'No se encontró la categoría'});
        }        
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

//----------- POST -----------//
exports.createCategory = async function(category) {
    try {
        const newCategory = await Category.create({ name: category });
        return newCategory;        
    } catch (error) {
        console.log(error)
    }
};

//----------- PUT -----------//
exports.updateCategory = async function(id, category) {
    try {
        let dbCategory = await Category.findByPk(id);
        if (dbCategory) {
            dbCategory.name = category;
            await dbCategory.save();
        }
        return dbCategory;        
    } catch (error) {
        console.log(error)
    }
};

//----------- DELETE -----------//
exports.deleteCategory = async function(id) {
    try {
        let dbCategory = await Category.findByPk(id);
        if (dbCategory) {
            dbCategory.isActive = false;
            await dbCategory.save();
        }
        return dbCategory;        
    } catch (error) {
        console.log(error)
    }
};
