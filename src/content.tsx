import { Gitako } from 'components/Gitako'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { insertBookmarkLink, insertMountPoint, insertSideBarMountPoint } from 'utils/DOMHelper'
import { useAfterRedirect } from 'utils/hooks/useFastRedirect'
import './content.scss'

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

async function init() {
  await injectStyles(browser.runtime.getURL('content.css'))
  const mountPoint = insertSideBarMountPoint()
  insertBookmarkLink()
  document.addEventListener('soft-nav:progress-bar:end', insertBookmarkLink)
  const MountPointWatcher = () => {
    useAfterRedirect(React.useCallback(() => insertMountPoint(() => mountPoint), []))
    return null
  }

  createRoot(mountPoint).render(
    <>
      <MountPointWatcher />
      <Gitako />
    </>,
  )
}

// injects a copy of stylesheets so that other extensions(e.g. dark reader) could read
// resolves when style is loaded to prevent render without proper styles
async function injectStyles(url: string) {
  return new Promise<void>(resolve => {
    const linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('href', url)
    linkElement.onload = () => resolve()
    document.head.appendChild(linkElement)
  })
}
