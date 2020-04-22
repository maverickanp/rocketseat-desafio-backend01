const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  const { title } = request.query
  const results = title
  ? repositories.filter(repository => repository.title.includes(title))
  : repositories

  return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body
  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {

  if(request.body.hasOwnProperty('likes'))     
    return response.status(400).json({likes: 0})  

  const { id } = request.params
  const { title, url, techs } = request.body
  
  const repositoryIndex = repositories.findIndex(project => project.id === id)

  if(repositoryIndex < 0 )
    return response.status(400).json({error: "repository not found!"})

  const repository = repositories[repositoryIndex]
  repository.title = title
  repository.url = url
  repository.techs = techs   

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(project => project.id === id)

  if(repositoryIndex < 0 )
    return response.status(400).json({error: "repository not found!"})

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(project => project.id === id)

  if(repositoryIndex < 0 )
    return response.status(400).json({error: "repository not found!"})


  let repository = repositories[repositoryIndex]
  let likes = repository.likes === undefined ? 0 : repository.likes
  repository.likes = likes + 1

  return response.json(repository)
});

module.exports = app;
