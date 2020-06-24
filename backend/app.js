const express = require('express')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

module.exports = function () {
  let app = express()
  app.post('/upload', function (req, res) {
    let form = new formidable.IncomingForm()
    console.log('about to parse')
    new Promise(resolve => form.parse(req, function (error, fields, files) {
      if (error) {
        console.log('error parsing')
        return
      }
      console.log('parsing done')
      console.log(files['dirty-image'])
      let uploadDir = path.resolve(__dirname, 'tmp/upload/')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
      }
      let filename = path.resolve(uploadDir, files['dirty-image'].name)
      fs.writeFileSync(filename, fs.readFileSync(files['dirty-image'].path))
      resolve(filename)
    }))
      .then(rawImage => process(rawImage))
      .then(processedImage => {
        res.sendFile(processedImage)
      })
      .catch(e => {
        console.log('Error occured!')
        console.log(e)
      })
  })

  let server = app.listen(8088, function () {
    let host = server.address().address
    let port = server.address().port

    console.log('Backend listening at http://%s:%s', host, port)
  })
}

async function process (rawImage) {
  let outputImage = path.resolve(__dirname, 'tmp/output.jpg')
  await new Promise(resolve => sharp(rawImage)
    .grayscale()
    .toFile(outputImage, function (err) {
      if (err) {
        console.log('error processing image')
        console.log(err)
      }
      resolve()
    }))
  return outputImage
}
