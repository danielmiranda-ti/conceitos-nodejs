const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, likes, techs, url} = request.body;
  const repository = {
    id: uuid(), 
    likes: 0, 
    techs, 
    title, 
    url
  };
  repositories.push(repository);
  return response.status(401).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid repository ID."});
  }
  const {url, title, techs} = request.body;
  const repositoryIndex = repositories.findIndex(rep => {
    return rep.id === id
  });
  if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found"});
  }
  
  repository = {...repositories[repositoryIndex], 
    url, 
    title, 
    techs
  };
  repositories[repositoryIndex] = repository;
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid repository ID."});
  }
  const repositoryIndex = repositories.findIndex(rep => {return rep.id === id});
  if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found"});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repository = repositories.find(rep => {return rep.id === id});
  if(!repository){
    return response.status(400).json({error: "Repository not found"});
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
