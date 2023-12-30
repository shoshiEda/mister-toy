
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'


const app = express()

// Express Config:
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Get toys (READ)

 app.get('/api/toy', async (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        price: req.query.price || 0,
        inStock: req.query.inStock || false,
        catagory: req.query.catagory || 'All',
        sort:  req.query.sort || ''
    }

    //console.log(filterBy, req.query)
try{
    let toys = await toyService.query(filterBy)
            console.log(toys)
            res.send(toys)
}
catch(err)
{
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toy')
}
})


// Update toy (Update)
app.put('/api/toy', async (req, res) => {
    const toyToSave = {
        name: req.body.name,
        price: +req.body.price,
        _id: req.body._id,
    }
try{
    let toy = await toyService.save(toyToSave)
        res.send(toy)
}
catch(err){
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        }
})

// Add toy (CREATE)
app.post('/api/toy', async (req, res) => {
    const toyToSave = {
        name: req.body.name,
        price: +req.body.price,
       
    }
    //console.log(req.query, req.body, toyToSave)
try{
    let toy = await toyService.save(toyToSave)
        res.send(toy)
}
catch(err){
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        }
})


// Get toy (READ)
app.get('/api/toy/:id', async (req, res) => {
    const toyId = req.params.id
    try{
    let toy = await toyService.getById(toyId)
     toy => res.send(toy)
    }
    catch(err){
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        }
})

// Remove Car (DELETE)
app.delete('/api/toy/:id', async (req, res) => {
    const toyId = req.params.id
    try{
    await toyService.remove(toyId)
    res.send(toyId)
    }
    catch(err) {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        }
})




const port = process.env.PORT || 3030
app.listen(port, () =>
console.log(`Server listening on port http://127.0.0.1:${port}/`)
)

