const knex = require("../database/knex");

class TagsController {

  //Listando as tags
  async index(request, response) {
    const { user_id } = request.params;

    const tags = await knex("tags")
      .where({ user_id })

    return response.json(tags);
  }
}

module.exports = TagsController;