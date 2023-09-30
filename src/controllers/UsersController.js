const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection()
    //Verificar se o email já esta cadastrado
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (checkUserExists) {
      throw new AppError("Este email já esta em uso.")
    }

    //Criptografa a senha 
    const hashedPassword = await hash(password, 8)

    await database.run(
      "INSERT INTO users (name , email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    //Funçãp pra buscar usuário 
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id] )

    //Verificar se o usuário existe
    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    //Verificar se ele quer mudar pra outro email que ja existe
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já esta em uso.")
    }

      user.name = name;
      user.email = email; 

      await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        updated_at = ?
        WHERE ID = ?`,
        [user.name, user.email, new Date(), id]
      );

      return response.json()
    
    
  }
}

module.exports = UsersController;
