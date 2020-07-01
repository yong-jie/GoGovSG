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
      pointHitRadius: 20,
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
                  padding: 8,
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
            callbacks: {
              title: (tooltipItems, data) => {
                const index = tooltipItems[0].index ?? 0
                const label = data.labels?.[index].toString() ?? ''
                const fullDate = moment(label, 'D MMM').format('DD MMMM yyyy')
                return fullDate.toString()
              },
              label: (tooltipItem) => {
                const label = tooltipItem.yLabel
                return `${label} clicks`
              },
            },
            xPadding: 20,
            yPadding: 10,
            titleFontSize: 14,
            bodyFontSize: 14,
            backgroundColor: '#384A51',
            displayColors: false,
          },
        }}
      ></Line>
    </Statistic>
  )
}
