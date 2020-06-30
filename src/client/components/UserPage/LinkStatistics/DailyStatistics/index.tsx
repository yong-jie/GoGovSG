import React from 'react'
import { Line } from 'react-chartjs-2'

import Statistic from '../Statistic'
import { DailyClicksInterface } from '../../../../../shared/interfaces/link-statistics'
import moment from 'moment'

export type DailyStatisticsProps = {
  dailyClicks: DailyClicksInterface[]
}

export function processData(data: DailyClicksInterface[]) {
  const labels = data.map((day) => {
    return moment(day.date, 'yyyy-MM-DD').format('D MMM')
  })
  const points = data.map((day) => day.clicks)
  const datasets = [
    {
      fill: false,
      lineTension: 0,
      backgroundColor: '#456682',
      borderColor: '#456682',
      pointColor: '#456682',
      pointStrokeColor: '#456682',
      pointRadius: 0,
      pointHoverRadius: 5,
      data: points,
    },
  ]
  return { labels, datasets }
}

export default function DailyStatistics(props: DailyStatisticsProps) {
  const data = processData(props.dailyClicks)
  return (
    <Statistic title="How many users have visited your link?">
      <Line
        data={data}
        legend={{ display: false }}
        options={{
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  padding: 5,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  padding: 5,
                },
              },
            ],
          },
          tooltips: {
            xPadding: 10,
            yPadding: 10,
          },
        }}
      ></Line>
    </Statistic>
  )
}
