export default {
  relativeHumidity: {
    high: 90,
    low: 80
  },
  freshAirExchange: {
    schedules: [
      {time: '0 0 * * *', runTimeSeconds: 60},
      {time: '0 8 * * *' , runTimeSeconds: 60},
      {time: '0 16 * * *', runTimeSeconds: 60}
    ]
  },
  temp: 25
}