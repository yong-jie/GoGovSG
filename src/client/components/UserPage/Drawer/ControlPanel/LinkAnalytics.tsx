import React from 'react'
import { Typography, createStyles, makeStyles } from '@material-ui/core'

import LinkStatistics from '../../LinkStatistics'

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogTitleDiv: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 116,
      marginBottom: 44,
    },
    copyLinkDiv: {
      display: 'flex',
    },
    copyIcon: {
      marginRight: 5,
    },
    linkAnalyticsDiv: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '141px',
    },
    linkAnalyticsText: {
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    titleText: {
      marginBottom: 10,
    },
    subtitleText: {
      marginBottom: 20,
    },
    feedbackButton: {
      height: 44,
      width: '100%',
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: 200,
      },
    },
  }),
)

export default function LinkAnalytics() {
  const classes = useStyles()

  return (
    <div className={classes.linkAnalyticsDiv}>
      <Typography className={classes.titleText} variant="h3" color="primary">
        Click history
      </Typography>
      <Typography
        className={classes.subtitleText}
        variant="body1"
        color="primary"
      >
        View real-time analytics of your link, and sort by time period.
      </Typography>
      <LinkStatistics />
    </div>
  )
}
