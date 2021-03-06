//TODO this needs to live on the API and be fetched

export default {
  relativeHumidity: {
    target: 95,
    useFanToLower: false,
    usePID: false
  },
  schedules: [
    {
      cron: '0 0 * * *',
      runTimeSeconds: 200,
      outlet: 'EXHAUST_FAN_OUTLET'
    },
    {
      cron: '0 4 * * *',
      runTimeSeconds: 200,
      outlet: 'EXHAUST_FAN_OUTLET'
    },
    {
      cron: '0 12 * * *',
      runTimeSeconds: 200,
      outlet: 'EXHAUST_FAN_OUTLET'
    },
    {
      cron: '0 16 * * *',
      runTimeSeconds: 200,
      outlet: 'EXHAUST_FAN_OUTLET'
    },




    {
      cron: '0 * * * *',
      runTimeSeconds: 400,
      outlet: 'HUMIDIFER_OUTLET'
    },
    {
      cron: '0 * * * *',
      runTimeSeconds: 400,
      outlet: 'HUMIDIFER_FAN_OUTLET'
    },
    // {
    //   cron: '30 * * * *',
    //   runTimeSeconds: 60,
    //   outlet: 'HUMIDIFER_OUTLET'
    // },
    // {
    //   cron: '30 * * * *',
    //   runTimeSeconds: 120,
    //   outlet: 'HUMIDIFER_FAN_OUTLET'
    // }
  ],
  temp: 24
}