const express = require('express')
const formidable = require('formidable')
const fs = require('fs')

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
      fs.writeFileSync('backend/tmp/' + files['dirty-image'].name, fs.readFileSync(files['dirty-image'].path))
      resolve()
    }))
      .then(() => {
        res.write('hi')
        res.end()
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
