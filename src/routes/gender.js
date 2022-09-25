const genderRouter = require('express').Router()
const Gender = require('../models/gender.js');
const Serie = require('../models/serie.js');

genderRouter.get('/', async (request, response) => {
    try {
        const genders = await Gender.findAll({ include: [Serie] });
        response.json(genders)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

genderRouter.post('/', async (request, response) => {
    try {
        const newGender = await Gender.create(request.body);
        return response.json(newGender);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

genderRouter.get('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const gender = await Gender.findByPk(id)
        if (!gender) {
            return response.status(400).json({ "message": "Movie Not Found" });
        }
        response.json(gender);
    } catch (error) {
        response.status(500).json({
            message: error.message,
        });
    }
})

genderRouter.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { image, name } = request.body;
        const gender = await Gender.findByPk(id);
        await gender.update({ image, name })
        await gender.save();
        response.json(gender);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})

genderRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        await Gender.destroy({
            where: {
                id,
            },
        });
        return response.sendStatus(204);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
})

module.exports = genderRouter