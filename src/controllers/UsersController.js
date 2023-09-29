const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")

class UsersController {
 async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection()
    //Verificar se o email já esta cadastrado
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError("Este email já esta em uso.")
    }

    response.status(201).json()
  }
}

module.exports = UsersController;
