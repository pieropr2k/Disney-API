const serieRouter = require('express').Router()
const Character = require('../models/character.js');
const Serie = require('../models/serie.js');
const { Op } = require("sequelize");

serieRouter.get('/', async (request, response) => {
    const {name, genre, order} = request.query;
    try {
        const series = await Serie.findAll({
            attributes: ['id', 'image', 'title', 'creationDate', 'GenderId'],
            where: (name || genre) ? {
                [Op.or]: [
                    name ? {title: {
                        [Op.iLike]: `%${name}%`
                    }} : {},
                    genre ? {GenderId: genre} : {}
                ]
            }
            : {},
            order: (order==='ASC' || order==='DESC') ? [
                ['creationDate', order],
            ]
            : []
        });
        response.json(series)
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

serieRouter.post('/', async (request, response) => {
    const { image, title, creationDate, rating, GenderId } = request.body;
    try {
        const newSerie = await Serie.create(
            { image, title, creationDate, rating, GenderId }
        );
        return response.json(newSerie);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

serieRouter.get('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const serie = await Serie.findOne({
            include: [Character],
            where: {
                id,
            },
        });
        if (!serie) {
            return response.status(400).json({ "message": "Movie Not Found" });
        }
        response.json(serie);
    } catch (error) {
        response.status(500).json({
            message: error.message,
        });
    }
})

serieRouter.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { image, title, creationDate, rating, GenderId } = request.body;
        const serie = await Serie.findByPk(id);
        await serie.update({ image, title, creationDate, rating, GenderId })
        await serie.save();
        response.json(serie);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})

serieRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const serieToDelete = await Serie.destroy({
            where: {
                id,
            },
        });
        if (!serieToDelete) {
            return response.status(400).json({ message: `There's no character with the ${id} id` });
        }
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})

serieRouter.post('/:id/add_character', async (request, response) => {
    const { id } = request.params;
    try {
        const { image, name, age, weight, history } = request.body;
        const theSerie = await Serie.findByPk(id);
        const newCharacter = await Character.create({ image, name, age, weight, history });
        theSerie.addCharacter(newCharacter);
        response.json(newCharacter);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

serieRouter.put('/:id/add_character/:characterid_to_add', async (request, response) => {
    const { id, characterid_to_add } = request.params;
    try {
        const theSerie = await Serie.findByPk(id);
        const characterToAdd = await Character.findByPk(characterid_to_add);
        if (!characterToAdd) {
            response.status(400).json({ "message": "Character Not Found" });
        }
        theSerie.addCharacter(characterToAdd);
        response.json(characterToAdd);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

serieRouter.put('/:id/delete_character/:characterid_to_delete', async (request, response) => {
    const { id, characterid_to_delete } = request.params;
    try {
        const theSerie = await Serie.findByPk(id);
        const serieCharacters = await theSerie.getCharacters({where: {id: characterid_to_delete}});
        if (serieCharacters.length === 0) {
            return response.status(400).json({ message: `The serie ${theSerie.title} doesn't have a character with the id ${characterid_to_delete}` });
        }
        const message = `Deleted the character ${serieCharacters[0].name} from ${theSerie.title} serie`
        theSerie.removeCharacter(serieCharacters[0]);
        return response.json({ message });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
})

module.exports = serieRouter