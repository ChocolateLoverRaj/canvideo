import { NextRouter } from 'next/router'

/**
 * Get an id from a router
 */
const getId = (router: NextRouter): string | undefined => router.query.id?.toString()

export default getId
