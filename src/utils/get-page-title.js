import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Fun数据工厂'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
