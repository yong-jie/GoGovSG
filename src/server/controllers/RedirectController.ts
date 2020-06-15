import Express from 'express'
import { inject, injectable } from 'inversify'
import { logger } from '../config'
import { NotFoundError } from '../util/error'
import parseDomain from '../util/domain'
import { DependencyIds } from '../constants'
import { AnalyticsLogger } from '../services/analyticsLogger'
import { RedirectControllerInterface } from './interfaces/RedirectControllerInterface'
import { RedirectService } from '../services/RedirectService'
import { RedirectType } from '../services/types'

const ERROR_404_PATH = '404.error.ejs'
const TRANSITION_PATH = 'transition-page.ejs'

@injectable()
export class RedirectController implements RedirectControllerInterface {
  private redirectService: RedirectService

  private analyticsLogger: AnalyticsLogger

  public constructor(
    @inject(DependencyIds.redirectService) redirectService: RedirectService,
    @inject(DependencyIds.analyticsLogging) analyticsLogger: AnalyticsLogger,
  ) {
    this.redirectService = redirectService
    this.analyticsLogger = analyticsLogger
  }

  public redirect: (
    req: Express.Request,
    res: Express.Response,
  ) => Promise<void> = async (req, res) => {
    const { shortUrl }: { shortUrl: string } = req.params

    // Short link must not be null
    if (!shortUrl) {
      res.status(404).render(ERROR_404_PATH, { shortUrl })
      return
    }

    try {
      // Find longUrl to redirect to
      const {
        longUrl,
        visitedUrls,
        redirectType,
      } = await this.redirectService.redirectFor(
        shortUrl,
        req.session!.visits,
        req.get('user-agent') || '',
      )

      req.session!.visits = visitedUrls

      this.analyticsLogger.logRedirectAnalytics(
        req,
        res,
        shortUrl.toLowerCase(),
        longUrl,
      )

      if (redirectType === RedirectType.TransitionPage) {
        // Extract root domain from long url.
        const rootDomain: string = parseDomain(longUrl)

        res.status(200).render(TRANSITION_PATH, {
          escapedLongUrl: RedirectController.encodeLongUrl(longUrl),
          rootDomain,
        })
      } else {
        res.status(302).redirect(longUrl)
      }
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        logger.error(
          `Redirect error: ${error} ${error instanceof NotFoundError}`,
        )
      }

      res.status(404).render(ERROR_404_PATH, { shortUrl })
    }
  }

  /**
   * Encodes the long URL to be template safe. Currently this function
   * only templates the double-quote character as it is invalid according
   * to [RFC 3986](https://tools.ietf.org/html/rfc3986#appendix-C).
   * @param {string} longUrl The long URL before templating.
   * @return {string} The template-safe URL.
   */
  private static encodeLongUrl(longUrl: string) {
    return longUrl.replace(/["]/g, encodeURIComponent)
  }
}

export default RedirectController