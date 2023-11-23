import fs from 'fs'
import express from 'express'
import ViteExpress from 'vite-express'

const port = process.env.PORT || 3000

const app = express();
app.use(express.json({ limit: '1mb' })) // for json data

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on: http://localhost:${port}`)
);

// Logs
function writeLog(log) {
  const timestamp = Date.now()
  const data = `[${timestamp}] ${log}\n` 
  fs.appendFile('logs', data, () => {})
}

// Get current corn price
async function getCurrentCornPrice() {
  return(
    fetch('https://www.alphavantage.co/query?function=CORN&interval=monthly&apikey=demo', {method: "GET"})
      .then(response => response.json())
      .then(data => { return { success:true, data: data.data[0].value } })
      .catch(error => { return { success:false, error: error } })
  )
}

// Get historical corn price
async function getHistoricalCornPrice() {
  return(
    fetch('https://www.alphavantage.co/query?function=CORN&interval=monthly&apikey=demo', {method: "GET"})
      .then(response => response.json())
      .then(data => { return { success:true, data: data.data } })
      .catch(error => { return { success:false, error: error } })
  )
}

// Endpoint: get historical corn price
app.get('/api/corn-price/', async (req, res) => {
  let response = await getHistoricalCornPrice()

  if (response.success) {
    let cornPrice = response.data

    cornPrice = cornPrice.filter((dataPoint) => dataPoint.value != ".")
    cornPrice = cornPrice.map((dataPoint) => {
      let date = new Date(dataPoint.date);
      let dateFormatted = date.toLocaleDateString("en-US", {year: 'numeric', month: 'short'})
      return {
        date: dateFormatted, 
        value: dataPoint.value
      }
    })
    cornPrice.reverse();

    writeLog(`Success /api/corn-price`)

    return res.status(200).json({
      status: "success",
      data: {
        cornPrice
      },
      message: "Data retrieved successfully"
    })
  } else {
    writeLog(`Error /api/corn-price: ${response.error}`)

    return res.status(400).json({
      status: "error",
      message: response.error
    })
  }
})

// Endpoint: get the amount of corn (in kg) you can buy with your money (in usd)
app.post('/api/corn-amount/', async (req, res) => {
  if (!req.body.usd || !Number(req.body.usd)) {
    writeLog(`Error /api/corn-amount: incorrect arguments`)

    return res.status(400).json({
      status: "error",
      message: "Incorrect argument"
    })
  }

  let usd = req.body.usd
  let response = await getCurrentCornPrice()

  if (response.success) {
    let currentCornPrice = response.data
    let cornAmount = (1000 / currentCornPrice) * usd
    writeLog(`Success /api/corn-amount: ${cornAmount}`)

    return res.status(200).json({
      status: "success",
      data: {
        cornAmount
      },
      message: "Data retrieved successfully"
    })
  } else {
    writeLog(`Error /api/corn-amount: ${response.error}`)

    return res.status(400).json({
      status: "error",
      message: response.error
    })
  }
})