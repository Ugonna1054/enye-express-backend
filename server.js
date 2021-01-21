const express = require('express')
const axios = require('axios')
const cors = require('cors')
const logger = require('express-logger')
const morgan = require('morgan')

const app = express()

app.set('port', process.env.PORT || 2000)

// debugging
switch (app.get('env')) {
  case 'development':
    // compact, colorful dev logging
    app.use(morgan('dev'))
    break
  case 'production':
    // module 'express-logger' supports daily log rotation
    app.use(
      logger({
        path: __dirname + '/log/requests.log',
      })
    )
    break
}

// api routes
app.use('/api', cors())

app.get('/api/rates', (req, res) => {
  // console.log('Path', req.search)
  let { base, currency } = req.query
  // console.log('Base', base)
  // let base = req.query.base ?? ''
  // let currency = req.query.currency ?? ''

  base = base.trim().length() === 3 ? base : ''
  currency = currency.trim().length() >= 3 ? currency : ''

  const url = `https://api.exchangeratesapi.io/latest/?base=${base.toUpperCase()}&currency=${currency.toUpperCase()}`

  axios
    .get(url)
    .then((re) => {
      let rates = req.query.currency.split(',')
      let allrates = {}
      rates.foreach((ra) => {
        allrates[ra] = re.data.rates[ra]
      })

      console.log(data.results.rates)

      const data = {
        results: {
          base: base,
          date: re.data.date,
          rates: allrates,
        },
      }
      console.log(data.results.rates)

      res.json({ data, status: 200 })
    })
    .catch((re) => {
      throw new Error(re)
      res.status({ status: re.status }).json('Sorry there was an error!')
    })
})

// 404
app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not found')
})

// 500
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.type('text/plain')
  res.status(500)
  res.send('500 - Server Error')
})

// PORT
app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://localhost:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  )
})
