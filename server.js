const express = require('express')
const axios = require('axios')
const cors = require('cors')
const logger = require('express-logger')
const morgan = require('morgan');

//for making http calls in node rather than axios..çç
const fetch = require('node-fetch');

const app = express()

app.set('port', process.env.PORT || 2000)

// debugging
switch (app.get('env')) {
  case 'development':
    // compact, colorful dev logging
    app.use(morgan('dev'));
    //Use this when u want to pass in a request body
    //app.use(express.json({ limit: "50mb", extended: true }));
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

  //return res.send(req.query)
  // let base = "200";
  // let currency ="ngn";
  // console.log('Base', base)
  // let base = req.query.base ?? ''
  // let currency = req.query.currency ?? ''

 // base = base.trim().length() === 3 ? base : ''
  //currency = currency.trim().length() >= 3 ? currency : ''

  //const url = `https://api.exchangeratesapi.io/latest?base=${base}`

  fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
    .then(res => res.json())
    .then(json => {
      return res.send(json)
    })
    .catch(err => {
      return res.send(err);
    })

  // axios
  //   .get(url)
  //   .then((resp) => {
  //     // let rates = req.query.currency.split(',')
  //     // let allrates = {}
  //     // rates.foreach((ra) => {
  //     //   allrates[ra] = re.data.rates[ra]
  //     // })

  //     // console.log(data.results.rates)

  //     // const data = {
  //     //   results: {
  //     //     base: base,
  //     //     date: re.data.date,
  //     //     rates: allrates,
  //     //   },
  //     // }
  //     // console.log(data.results.rates)

  //     // res.json({ data, status: 200 })
  //     res.send(resp)
  //   })
  //   .catch((err) => {
      
  //     res.status(500).send(err)
  //   })
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
  res.send(err)
})

// PORT
app.listen(app.get('port'), () => {
  console.log(
    `Express started on http://localhost:${app.get(
      'port'
    )}; press Ctrl-C to terminate.`
  )
})
