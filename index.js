const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const fetch = require('node-fetch')
require('dotenv').config()

//1406


const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'main'
}))

app.listen(8888, () => {
    console.log('server is listening on port 8888')
})

async function getProjects() {
    const response = await (await fetch('https://api.github.com/users/Robust-ness/repos', {
        headers: {
            'Authorization': `Bearer ${process.env.token}`
        }
    })).json()
    let html = `
    <div class="home-background"></div>
    <div class="all-projects">
    <div class="my-projects">
        <h1 class="projects-title">My Projects</h1>
        <p class="projects-description">These are the past projects I've worked on</p>
    </div>`
    response.forEach(element => {
        html += `
        <div class="project">
            <img src="${element.name}.png" alt="" class="project-picture">
            <div class="project-info">
                <p class="project-title">
                    ${element.name}
                </p>
                <p class="project-description">${element.description}</p>
                <a href="${element.html_url}" class="project-link">Github Repo</a>
                <a href="${element.homepage}" class="project-link">Site</a>
            </div>
        </div>
        `
    });
    html += '</div>'
    return html
}

//getProjects()







app.get('/projects', async (req, res) => {
    try {
        res.render('projects', {
            helpers: {
                projects: await getProjects()
            },
            docTitle: 'My Projects'
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/', async (req, res) => {
    res.render('home', {
        docTitle: 'Home'
    })
})


