import { IStackStyles, mergeStyleSets, Stack } from '@fluentui/react'
import { useToggle } from 'hooks'
import React, { useEffect, useRef, useState } from 'react'

import { AppBar } from 'components/json-editor/app-bar'
import { CommandBar } from 'components/json-editor/command-bar'
import { JSONEditor } from 'components/json-editor/json-editor'
import { SampleData } from 'components/json-editor/json-editor/mock-data'

enum Editor {
    Schema = 'Schema',
    InputJson = 'Input JSON',
}

// Mutating styles definition
const containerStyle = (): IStackStyles => {
    return {
        root: {
            height: '100vh',
        },
    }
}

const editorStackStyle: IStackStyles = {
    root: {
        height: '100%',
    },
}

export const getEditorClassNames = ({ isFullWidth }: { isFullWidth: boolean }): IStackStyles =>
    mergeStyleSets({
        root: [
            {
                width: '50%',
                height: '100%',
            },
            isFullWidth && {
                width: '100%',
                height: '100%',
            },
        ],
    })

const App = (): JSX.Element => {
    return (
        <Stack styles={containerStyle}>
            <Stack wrap horizontal grow styles={editorStackStyle}>
                <Stack.Item
                    styles={getEditorClassNames({
                        isFullWidth: true,
                    })}
                >
                    <JSONEditor title={''} path="input_json.json" defaultValue={undefined} />
                </Stack.Item>
            </Stack>
        </Stack>
    )
}

const AppContainer = (): JSX.Element => <App />

export default AppContainer
