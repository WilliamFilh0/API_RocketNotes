require("express-async-errors")

const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const express = require("express");

const routes = require("./routes")
migrationsRun()

const app = express();
app.use(express.json())

app.use(routes) 

//Verifica se o erro for do usuário
app.use((error, request, reponse, next) => {
  if(error instanceof AppError){
    return reponse.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  //Verifica se o erro for do servidor
  console.error(error)

  return reponse.status(500).json({
    status: "error",
    message:"Internal server error",
  })

})

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
