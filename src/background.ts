// import addDomainPermissionToggle from 'webext-domain-permission-toggle'
import 'webext-dynamic-content-scripts'
import browser from 'webextension-polyfill'

// fixme: MV3 配置下, 这个无法使用, 所以不能 PR 到上游
// webext-permission-toggle 5.0.1 也无法正常使用, webpack 的配置问题, 但是目前还不知道是咋回事
// addDomainPermissionToggle({
//   title: 'Enable Gitako on this domain',
//   reloadOnSuccess: 'Refresh to activate Gitako?',
// })

const storage = browser.storage.local
const key = 'gitakoBookmarks'

type Data = {
  url: string
  type: string
  timestamp: number
}

class Storage {
  async get(): Promise<Data[]> {
    const value = await storage.get([key])
    return JSON.parse(value.gitakoBookmarks) || []
  }

  async set(data: Data) {
    const value = await this.get()
    value.push(data)
    return storage.set({ [key]: JSON.stringify(value.sort((a, b) => a.timestamp - b.timestamp)) })
  }

  async remove(data: Data) {
    const value = await this.get()
    const index = value.findIndex(item => item.url === data.url)
    if (index !== -1) {
      value.splice(index, 1)
      return storage.set({ [key]: JSON.stringify(value.sort((a, b) => a.timestamp - b.timestamp)) })
    }
  }
}

browser.runtime.onMessage.addListener(
  async (message: {
    type: string
    data: {
      url: string
      type: string
      timestamp: number
    }
  }) => {
    const s = new Storage()

    switch (message.type) {
      case 'get-bookmarks':
        return s.get()
      case 'set-bookmarks':
        return s.set(message.data)
      case 'remove-bookmarks':
        return s.remove(message.data)
      case 'toggle-bookmarks': {
        const bookmarks = await s.get()
        const index = bookmarks.findIndex(item => item.url === message.data.url)
        if (index !== -1) {
          await s.remove(message.data)
          return false
        } else {
          await s.set(message.data)
          return true
        }
      }
      case 'is-bookmarked': {
        const bookmarks = await s.get()
        return bookmarks.some(item => item.url === message.data.url)
      }
    }
  },
)
