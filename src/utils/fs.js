// import fs from 'fs'
const fs = require('fs');

export function readdir(path) {
    let tmp = fs.readdir(path)
    console.log(tmp);
    return tmp;
}