import { ChevronDownIcon } from '@primer/octicons-react'
import { Box } from '@primer/react'
import { Footer } from 'components/Footer'
import { RoundIconButton } from 'components/RoundIconButton'
import { useConfigs } from 'containers/ConfigsContext'
import { platform } from 'platforms'
import { GitHub } from 'platforms/GitHub'
import * as React from 'react'
import { useUpdateEffect } from 'react-use'
import { useStateIO } from 'utils/hooks/useStateIO'
import { AccessTokenSettings } from './AccessTokenSettings'
import { FileTreeSettings } from './FileTreeSettings'
import { SettingsSection } from './SettingsSection'
import { SidebarSettings } from './SidebarSettings'
import { SimpleConfigField } from './SimpleConfigField'
import { SimpleConfigFieldCheckbox } from './SimpleConfigField/Checkbox'

const WIKI_HOME_LINK = 'https://github.com/EnixCoda/Gitako/wiki'
export const wikiLinks = {
  compressSingletonFolder: `${WIKI_HOME_LINK}/Compress-Singleton-Folder`,
  changeLog: `${WIKI_HOME_LINK}/Change-Log`,
  codeFolding: `${WIKI_HOME_LINK}/Code-folding`,
  copySnippet: `${WIKI_HOME_LINK}/Copy-file-and-snippet`,
  createAccessToken: `${WIKI_HOME_LINK}/Access-token-for-Gitako`,
  pjaxMode: `${WIKI_HOME_LINK}/Pjax-Mode`,
  bye: `${WIKI_HOME_LINK}/About-to-say-good-bye`,
}

const moreFields: SimpleConfigField<'copySnippetButton' | 'codeFolding' | 'pjaxMode'>[] =
  platform === GitHub
    ? [
        {
          key: 'codeFolding',
          label: 'Fold source code button',
          wikiLink: wikiLinks.codeFolding,
          tooltip: `Read more in Gitako's Wiki`,
        },
        {
          key: 'pjaxMode',
          label: 'Native PJAX mode',
          wikiLink: wikiLinks.pjaxMode,
          tooltip: 'Please keep it enabled unless Gitako crashes after redirecting',
          overwrite: {
            value: pjaxMode => pjaxMode === 'native',
            onChange: checked => (checked ? 'native' : 'pjax-api'),
          },
        },
        {
          key: 'copySnippetButton',
          label: 'Copy snippet button',
          wikiLink: wikiLinks.copySnippet,
          tooltip: `Read more in Gitako's Wiki`,
        },
      ]
    : []

export function SettingsBarContent({
  toggleShowSettings,
  toggleShowBookmarks,
}: {
  toggleShowSettings: () => void
  toggleShowBookmarks: () => void
}) {
  const useReloadHint = useStateIO<React.ReactNode>('')
  const { value: reloadHint } = useReloadHint

  useUpdateEffect(() => {
    window.location.reload()
  }, [useConfigs().value.pjaxMode])

  return (
    <div className={'gitako-settings-bar'}>
      <div className={'gitako-settings-bar-header'}>
        <h2 className={'gitako-settings-bar-title'}>Settings</h2>
        <RoundIconButton
          aria-label="Close settings"
          onClick={toggleShowSettings}
          size="medium"
          iconSize={20}
          icon={ChevronDownIcon}
          color="fg.default"
        />
      </div>
      <Box display="grid" gridGap={4} className={'gitako-settings-bar-content'}>
        <div className={'shadow-shelter'} />
        <AccessTokenSettings />
        <SidebarSettings />
        <FileTreeSettings />
        {moreFields.length > 0 && (
          <SettingsSection title={'More'}>
            {moreFields.map(field => (
              <React.Fragment key={field.key}>
                <SimpleConfigFieldCheckbox field={field} />
              </React.Fragment>
            ))}

            {reloadHint && <div className={'hint'}>{reloadHint}</div>}
          </SettingsSection>
        )}
        <SettingsSection title={'Talk to the author'}>
          <div>
            <a
              href="https://github.com/EnixCoda/Gitako/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report bug
            </a>
            {' / '}
            <a
              href="https://github.com/EnixCoda/Gitako/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss feature
            </a>
          </div>
        </SettingsSection>
      </Box>
      <Footer toggleShowSettings={toggleShowSettings} toggleShowBookmarks={toggleShowBookmarks} />
    </div>
  )
}
