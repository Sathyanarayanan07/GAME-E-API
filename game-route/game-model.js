const Joi = require('@hapi/joi');

const gameSchema = Joi.object({
    game_name: Joi.string()
        .min(1)
        .max(100)
        .required(),
    game_genre: Joi.string()
        .min(3)
        .max(30)
        .required(),
    game_thumbnail_image: Joi.string()
        .min(3)
        .required(),
    game_overview: Joi.string()
        .min(30)
        .max(100)
        .required(),
    game_descriptiom: Joi.string()
        .min(100)
        .max(1000)
        .required(),
    game_sharp_rating: Joi.number()
        .integer()
        .min(1)
        .max(10),
})

module.exports.gameSchema = gameSchema