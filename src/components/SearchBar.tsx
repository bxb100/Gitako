import { SearchIcon } from '@primer/octicons-react'
import { TextInput, TextInputProps } from '@primer/react'
import { useConfigs } from 'containers/ConfigsContext'
import * as React from 'react'
import { cx } from 'utils/cx'
import { isValidRegexpSource } from 'utils/general'
import { SearchMode } from './searchModes'

type Props = {
  value: string
  onSearch: (searchKey: string, searchMode: SearchMode) => void
} & Required<Pick<TextInputProps, 'onFocus'>>

export function SearchBar({ onSearch, onFocus, value }: Props) {
  const configs = useConfigs()
  const { searchMode } = configs.value

  const toggleButtonDescription =
    searchMode === 'regex'
      ? 'Match file name with regular expression.'
      : `Match file path sequence with plain input.`

  return (
    <div className={'search-input-wrapper'}>
      <TextInput
        leadingVisual={SearchIcon}
        onFocus={e => {
          onFocus(e)
          e.target.select()
        }}
        tabIndex={0}
        className={cx('search-input', {
          error: searchMode === 'regex' && !isValidRegexpSource(value),
        })}
        aria-label="search files"
        placeholder={`Search files`}
        onChange={({ target: { value } }) => onSearch(value, searchMode)}
        value={value}
        trailingAction={
          <TextInput.Action
            onClick={() => {
              const newMode = searchMode === 'regex' ? 'fuzzy' : 'regex'
              configs.onChange({
                searchMode: newMode,
              })
              // Skip search if no input to prevent resetting folder expansions
              if (value) onSearch(value, newMode)
            }}
            aria-label={toggleButtonDescription}
            sx={{ color: 'fg.subtle' }}
          >
            {searchMode === 'regex' ? '.*$' : 'a/b'}
          </TextInput.Action>
        }
      />
    </div>
  )
}
