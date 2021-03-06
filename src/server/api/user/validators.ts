import * as Joi from '@hapi/joi'
import { ACTIVE, INACTIVE } from '../../models/types'
import blacklist from '../../resources/blacklist'
import {
  isHttps,
  isPrintableAscii,
  isValidShortUrl,
} from '../../../shared/util/validation'
import { LINK_DESCRIPTION_MAX_LENGTH } from '../../../shared/constants'
import { isValidGovEmail } from '../../util/email'

export const urlRetrievalSchema = Joi.object({
  userId: Joi.number().required(),
})

export const urlSchema = Joi.object({
  userId: Joi.number().required(),
  shortUrl: Joi.string()
    .custom((url: string, helpers) => {
      if (!isValidShortUrl(url)) {
        return helpers.message({ custom: 'Short url format is invalid.' })
      }
      return url
    })
    .required(),
  longUrl: Joi.string().custom((url: string, helpers) => {
    if (!isHttps(url)) {
      return helpers.message({ custom: 'Long url must start with https://' })
    }
    if (blacklist.some((bl) => url.includes(bl))) {
      return helpers.message({
        custom: 'Creation of URLs to link shortener sites prohibited.',
      })
    }
    return url
  }),
  files: Joi.object({
    file: Joi.object().keys().required(),
  }),
}).xor('longUrl', 'files')

export const urlEditSchema = Joi.object({
  userId: Joi.number().required(),
  shortUrl: Joi.string().required(),
  longUrl: Joi.string().custom((url: string, helpers) => {
    if (!isHttps(url)) {
      return helpers.message({ custom: 'Long url must start with https://' })
    }
    if (blacklist.some((bl) => url.includes(bl))) {
      return helpers.message({
        custom: 'Creation of URLs to link shortener sites prohibited.',
      })
    }
    return url
  }),
  files: Joi.object({
    file: Joi.object().keys().required(),
  }),
  state: Joi.string().allow(ACTIVE, INACTIVE).only(),
  isSearchable: Joi.boolean(),
  description: Joi.string()
    .allow('')
    .max(LINK_DESCRIPTION_MAX_LENGTH)
    .custom((description: string, helpers) => {
      if (!isPrintableAscii(description)) {
        return helpers.message({
          custom: 'Description must only contain ASCII characters.',
        })
      }
      return description
    }),
  contactEmail: Joi.string()
    .allow(null)
    .custom((email: string, helpers) => {
      if (!isValidGovEmail(email)) {
        return helpers.message({ custom: 'Not a valid gov email or null' })
      }
      return email
    }),
}).oxor('longUrl', 'files')

export const ownershipTransferSchema = Joi.object({
  userId: Joi.number().required(),
  shortUrl: Joi.string().required(),
  newUserEmail: Joi.string().required(),
})
