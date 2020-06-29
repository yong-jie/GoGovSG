import React from 'react'

import { useStatistics } from './util/statistics'
import { useDrawerState } from '../Drawer'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Statistics from './Statistics'

const useStyles = makeStyles(() => ({
  root: {
    margin: 20,
  },
}))

export default function LinkStatistics() {
  const classes = useStyles()
  const shortUrl = useDrawerState().relevantShortLink!
  const linkStatistics = useStatistics(shortUrl)

  // Still fetching link statistics.
  if (!Boolean(linkStatistics.status)) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    )
  }

  if (!Boolean(linkStatistics.contents)) {
    return <div className={classes.root}></div>
  }

  return <Statistics data={linkStatistics.contents!} />
}
