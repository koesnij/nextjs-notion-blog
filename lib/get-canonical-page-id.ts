import { ExtendedRecordMap } from 'notion-types'
import {
  parsePageId,
  uuidToId,
  normalizeTitle,
  getBlockTitle
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

const getCanonicalPageIdImpl = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  if (!pageId || !recordMap) return null

  const id = uuidToId(pageId)
  const block = recordMap.block[pageId]?.value
  if (block) {
    let slug

    console.log(block.properties)

    try {
      // get slug property
      if (block.properties['^SHh']) {
        slug = block.properties['^SHh'][0][0]
      } else if (block.properties['@_a]']) {
        slug = block.properties['@_a]'][0][0]
      } else {
        slug = block.properties['O=ij'][0][0]
      }
    } catch (err) {
      // get title
      slug = normalizeTitle(getBlockTitle(block, recordMap))
    }
    if (slug) {
      // if (uuid) {
      // return `${slug}-${id}`
      // } else {
      return slug
      // }
    }
  }

  return id
}

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  console.log('cleanPageId', cleanPageId)
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    return getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })
  }
}
