const characterRouter = require('express').Router()
const Character = require('../models/character.js');
const Serie = require('../models/serie.js');
const { Op } = require("sequelize");

characterRouter.get('/', async (request, response) => {
    const {name, age, movies} = request.query;
    try {
        const characters = await Character.findAll({ include: [Serie],
            attributes: ['id', 'image', 'name', 'age'],
            where: (name || age || movies) ? {
                [Op.or]: [
                    name ? {name: {
                        [Op.iLike]: `%${name}%`
                    }} : {},
                    age ? {age} : {},
                    movies ? {'$Series.id$': movies} : {}
                ],
            }
            : {}
        });
        response.json(characters);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

// You should put the serie of the character
characterRouter.post('/', async (request, response) => {
    const { image, name, age, weight, history, serieId } = request.body;
    try {
        const newCharacter = await Character.create(
            { image, name, age, weight, history }
        );
        const characterSerie = await Serie.findByPk(serieId)
        if (characterSerie) {
            newCharacter.addSerie(characterSerie)
        }
        response.json(newCharacter);
    } catch (error) {
        response.status(500).json({
            message: error.message,
        });
    }
})

characterRouter.get('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const character = await Character.findOne({
            include: [Serie],
            where: {
                id,
            },
        });
        //const character = await Character.findByPk(id)
        if (!character) {
            return response.status(400).json({ "message": "Character Not Found" });
        }
        response.json(character);
    } catch (error) {
        response.status(500).json({
            message: error.message,
        });
    }
})

characterRouter.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { image, name, age, weight, history } = request.body;
        const character = await Character.findByPk(id);
        if (!character) {
            return response.status(400).json({ "message": "Character Not Found" });
        }
        await character.update({ image, name, age, weight, history })
        await character.save();
        response.json(character);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})

characterRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const characterToDelete = await Character.destroy({
            where: {
                id,
            },
        });
        if (!characterToDelete) {
            return response.status(400).json({ message: `There's no character with the ${id} id` });
        }
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})

characterRouter.put('/:id/add_movie/:serieid_to_add', async (request, response) => {
    const { id, serieid_to_add } = request.params;
    try {
        const theCharacter = await Character.findByPk(id);
        const serieToAdd = await Serie.findByPk(serieid_to_add);
        if (!serieToAdd) {
            return response.status(400).json({ "message": "Serie Not Found" });
        }
        theCharacter.addSerie(serieToAdd);
        //console.log(`Added movie ${serieToAdd.title} to ${theCharacter.name} character`);
        response.json({ message: `Added movie ${serieToAdd.title} to ${theCharacter.name} character`});
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

characterRouter.put('/:id/delete_movie/:serieid_to_delete', async (request, response) => {
    const { id, serieid_to_delete } = request.params;
    try {
        const theCharacter = await Character.findOne({ include: [Serie],
            where: {
                id
            }
        });
        const characterSeries = await theCharacter.getSeries({where: {id: serieid_to_delete}});
        if (characterSeries.length === 0) {
            return response.status(400).json({ message: `The character ${theCharacter.name} doesn't have a serie with the id ${serieid_to_delete}` });
        }
        const message = `Deleted the serie ${characterSeries[0].title} from ${theCharacter.name} character`
        theCharacter.removeSerie(characterSeries[0]);
        return response.json({ message });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
})

module.exports = characterRouter