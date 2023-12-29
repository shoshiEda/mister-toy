import fs from 'fs'
import { utilService } from "./util.service.js";


export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')
//console.log(toys)



function query(filterBy) {
    let toysToReturn = toys
    //console.log(toysToReturn)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toysToReturn = toysToReturn.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.price) {
        toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.price)
    }

    /*if (filterBy.inStock==="true") {
        console.log(filterBy.inStock)
        toysToReturn = toysToReturn.filter(toy => toy.inStock)}*/
    if(filterBy.catagory!=='All')
    toysToReturn=toysToReturn.filter(toy => 
{
    //console.log(toy, toy.labels)
    toy.labels.includes(filterBy.catagory)
    })
      if (filterBy.sort==='price') {
        toysToReturn.sort((c1, c2) => (c1.price - c2.price))
    } else if (filterBy.sort==='name') {
        toysToReturn.sort((c1, c2) => c1.name.localeCompare(c2.name))
    }
    else if (filterBy.sort==='date') {
        toysToReturn.sort((c1, c2) => (c1.createdAt - c2.createdAt))
  }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('toy dosent exist!')
    
    return Promise.resolve(toy)
}

function remove(toyId) {
    const toyIdx = toys.findIndex(toy => toy._id === toyId)
    toys.splice(toyIdx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const toyIdx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[toyIdx] = toy
    } else {
        toy._id = utilService.makeId()
        toys.unshift(toy)
    }

    return _saveToysToFile().then(() => toy)
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}