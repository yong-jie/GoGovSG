import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { LinkStatisticsInterface } from '../../../../shared/interfaces/link-statistics'
import DeviceStatistics from './DeviceStatistics'
import DailyStatistics from './DailyStatistics'

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
    marginBottom: 20,
  },
}))

export type StatisticsProps = {
  data: LinkStatisticsInterface
}

export default function Statistics(props: StatisticsProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <DeviceStatistics deviceClicks={props.data.deviceClicks} />
      <DailyStatistics dailyClicks={props.data.dailyClicks} />
    </div>
  )
}
