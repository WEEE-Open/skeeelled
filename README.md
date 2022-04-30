<img src=".readme/skeeelled.svg" alt="skeeelled logo" height="150">

[![Lint](https://github.com/WEEE-Open/skeeelled/actions/workflows/linter.yml/badge.svg?branch=master)](https://github.com/WEEE-Open/skeeelled/actions/workflows/linter.yml)
[![CD](https://github.com/WEEE-Open/skeeelled/actions/workflows/cd.yml/badge.svg?branch=master)](https://github.com/WEEE-Open/skeeelled/actions/workflows/cd.yml)

A tutoring web platform which allows professors and students to collaborate:  
- **professors** can post exam questions, exercises, and give advice to students  
- **students** can answer questions, rate each other's answers, and simulate exams.

## How to develop

This repository is structured in the following way:
- a `client` directory for the ReactJS frontend
- an `ml` directory for the PyTorch auto-moderation ML pipelines
- a `server` directory for the FastAPI backend

You can run the whole package in one command: 
```bash
docker compose up -d
```
after having installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your macOS or Windows machine, or the `docker.io` package on your Linux machine.  
This command will bring up all the necessary Docker containers that are needed to run the project in development mode, plus some bonuses, exposed to you as follows:

| Service                                             | Address                                |
|-----------------------------------------------------|----------------------------------------|
| ReactJS Frontend Client                             | http://localhost:3000                  |
| Backend APIs                                        | http://localhost:8000/v1               |
| Backend APIs Documentation                          | http://localhost:8000/docs             |
| Mongo Express web UI for MongoDB                    | http://localhost:8081                  |
| Backend APIs (reverse proxied by nginx)             | http://localhost/v1                    |
| Backend static resources (reverse proxied by nginx) | http://localhost/static                |
| MongoDB                                             | mongodb://root:example@localhost:27017 |

It may be useful using the Docker Desktop dashboard to open a container's service port directly or to follow a specific container's logs, as shown below:

| Containers                                                                  | Single Container Logs                                                        |
|-----------------------------------------------------------------------------|------------------------------------------------------------------------------|
| ![Docker Desktop containers](.readme/screenshot_docker_desktop_compose.png) | ![Docker Desktop container logs](.readme/screenshot_docker_desktop_logs.png) |

If you're on Linux, [lazydocker](https://github.com/jesseduffield/lazydocker) is an excellent CLI alternative to display the same kind of information.

### `client`

To develop the client stand-alone:  

0. Install [Node.js](https://nodejs.org/en/) 
1. `cd client`
2. `npm i`
3. `npm start`

If you intend to commit any changes, please also run `npm i` in the root (`skeeelled`) directory, so that the git pre-commit hooks can run correctly.  
At the moment we have configured husky to lint all the files residing in the `client` directory with `prettier`.  
All your changed files should be properly linted by this procedure to avoid unnecessary merge conflicts.

The latest commit to the `master` branch gets automatically deployed to our staging instance [👉 here 👈](https://weee-open.github.io/skeeelled).

### `server`

To develop the backend, we recommend to run `docker-compose up -d` as suggested above, since both MongoDB and FastAPI are required, and Mongo Express may be useful.

If you really want to go down the FastAPI stand-alone route (and note that you will have to run a MongoDB instance separately), you can run the following commands:  

0. Install [Python](https://www.python.org/downloads/)
1. `cd server`
2. `python3 -m venv venv`
3. `source venv/bin/activate` (or `source venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. `uvicorn main:app --host=0.0.0.0 --reload`

If you're using PyCharm Professional, I suggest you to add this configuration:

| Edit Configurations                                                                | Add Configuration                                                              |
|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| ![PyCharm edit configurations](.readme/screenshot_pycharm_edit_configurations.png) | ![PyCharm add configuration](.readme/screenshot_pycharm_add_configuration.png) |


### `ml`

TODO: add scrapers, dataset composition, comments, ML pipeline usage
