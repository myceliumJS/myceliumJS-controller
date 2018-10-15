import "@babel/polyfill";

import five from 'johnny-five';
import axios from 'axios';
import config from './config';
import SensorData from './sensorData';
import express from 'express';
import WifiOutLets from './WifiOutLets';
import { outletNames } from './const';
import Logger from './Logger';
// import schedule from 'node-schedule';
import growProfile from './growProfile'
import HeatLoop from "./heatLoop";

const logger = new Logger();


let initialized = false;
let sensorData = new SensorData();
console.log('index', sensorData)

let outlets = new WifiOutLets(config)
outlets.allOff().then().catch()


const heatLoop = new HeatLoop(sensorData, growProfile, outlets)




logger.info("Starting app")

const app = express();

app.get('/sensorData', (req, res) => res.send(sensorData.getLastReading()))
app.get('/initialized', (req, res) => res.send({initialized}))
app.listen(config.statusPort.port, () => console.log(`MyceliumJS listening on port ${config.statusPort}!`))

const initBoard = () => {
  let board = new five.Board({
    repl: false,
    debug: false,
  });

  board.on("ready", function() {
    initialized = true;

    var sensor = new five.Multi({
      controller: "HTU21D"
    });

    sensor.on("change", function() {
      sensorData.setData({
        relativeHumidityOne: this.hygrometer.relativeHumidity,
        tempatureCelsiusOne: this.thermometer.celsius
      })
    })
  });
}

const sendDataLoop = () => {

  let data = Object.assign(
    {},
    sensorData.data,
    {outletStatus: outlets.status},
    {initialized},
    {environmentId: config.growEnvironmentId}
  )

  logger.info(`Sending Data: ${JSON.stringify(data)}`)

  axios.post(config.myceliumApiUri, data, {headers: { 'x-api-key': config.myceliumApiSecret}})
    .catch((error) => console.log("Error contacting endpoint"))
    .finally(()=>{
     sensorData.clearData();
    });
  }


  const humditiyLoop = async () => {
    let humditiy = sensorData.getData().relativeHumidityOne

    if (humditiy < growProfile.relativeHumidity.low) {
      logger.info(`Humidity at ${humditiy} below threashold of ${growProfile.relativeHumidity.low}`);
      let humidifierStatus = await outlets.turn(outletNames.humidifier, true);
      let humidifierFanStatus = await outlets.turn(outletNames.humidifierFan, true);
    }

    if (humditiy > growProfile.relativeHumidity.high) {
      logger.info(`Humidity at ${humditiy} above threashold of ${growProfile.relativeHumidity.high}`);
      let humidifierStatus = await outlets.turn(outletNames.humidifier, false);
      let humidifierFanStatus = await outlets.turn(outletNames.humidifierFan, false);
    }
  }

  const freshAirExchange = (seconds) => {
    let time = seconds * 1000;
    outlets.turn(outletNames.freshAirExchange, true)
    setTimeout(outlets.turn, time, outletNames.freshAirExchange, false)
  }

  // const initSchedules = (schedules, fn) => {
  //   schedules.forEach(schedule => {
  //     schedule.scheduleJob(schedule.time, fn(schedule.seconds))
  //   });
  // }

  initBoard();
  setInterval(heatLoop.doLoop, config.myceliumApiUpdateSeconds)
  //initSchedules(growProfile.freshAirExchange.schedules, freshAirExchange);
  setInterval(sendDataLoop, config.myceliumApiUpdateSeconds);

  setInterval(humditiyLoop, config.myceliumHumidityUpdateSeconds);

