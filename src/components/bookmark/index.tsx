import * as React from 'react'
import { useEffect, useState } from 'react'
import { RoundIconButton } from '../RoundIconButton'
import { ChevronDownIcon, XIcon } from '@primer/octicons-react'
import { ActionList, Box } from '@primer/react'
import { Footer } from '../Footer'

type Data = {
  url: string
  type: string
  timestamp: number
}

export function BookmarkContent({
  toggleShowSettings,
  toggleShowBookmarks,
}: {
  toggleShowSettings: () => void
  toggleShowBookmarks: () => void
}) {
  const [bookmarks, setBookmarks] = useState<Data[]>([])
  useEffect(() => {
    browser.runtime
      .sendMessage({
        type: 'get-bookmarks',
      })
      .then(setBookmarks)
      .then(() => {
        browser.storage.onChanged.addListener(handler)
      })
    return () => browser.storage.onChanged.removeListener(handler)
  }, [])

  const remove = (url: string) => {
    browser.runtime
      .sendMessage({
        type: 'remove-bookmarks',
        data: {
          url: url,
        },
      })
      .then(() => {
        setBookmarks(bookmarks.filter(bookmark => bookmark.url !== url))
      })
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handler = (changes: any) => {
    if (changes.gitakoBookmarks) {
      const bookmarks = JSON.parse(changes.gitakoBookmarks.newValue)
      setBookmarks(bookmarks)
    }
  }

  return (
    <div className={'gitako-bookmark-bar'}>
      <div className={'gitako-bookmark-bar-header'}>
        <h2 className={'gitako-bookmark-bar-title'}>Bookmarks</h2>
        <RoundIconButton
          aria-label="Close bookmarks"
          onClick={toggleShowBookmarks}
          size="medium"
          iconSize={20}
          icon={ChevronDownIcon}
          color="fg.default"
        />
      </div>

      <Box display="grid" className={'gitako-bookmark-bar-content'}>
        <div className={'shadow-shelter'} />

        <ActionList>
          {bookmarks.map((bookmark, index) => (
            <ActionList.LinkItem href={bookmark.url} key={bookmark.url + index}>
              {new URL(bookmark.url).pathname.slice(1)}
              <ActionList.Description variant="block">
                {bookmark.url.replace(/https?:\/\//, '')}
              </ActionList.Description>
              <ActionList.TrailingVisual
                onClick={e => {
                  e.preventDefault()
                  remove(bookmark.url)
                }}
              >
                <XIcon />
              </ActionList.TrailingVisual>
            </ActionList.LinkItem>
          ))}
        </ActionList>
      </Box>

      <Footer toggleShowSettings={toggleShowSettings} toggleShowBookmarks={toggleShowBookmarks} />
    </div>
  )
}
