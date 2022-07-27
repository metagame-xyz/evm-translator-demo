import { BorderLine } from '../../styles'
import {
    DetailsList,
    IColumn,
    IDetailsHeaderProps,
    IRenderFunction,
    mergeStyleSets,
    ScrollablePane,
    ScrollbarVisibility,
    Sticky,
    StickyPositionType,
} from '@fluentui/react'
import React from 'react'
import { v4 as uuid } from 'uuid'

interface ErrorMessageBarProps {
    errors: string[]
}

const classNames = mergeStyleSets({
    wrapper: {
        height: 'inherit',
        position: 'relative',
    },
})

const headerStyle = {
    root: {
        padding: 0,
        borderTop: BorderLine,
    },
}

const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) return null
    return (
        <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
            {defaultRender!({
                ...props,
                styles: headerStyle,
            })}
        </Sticky>
    )
}

export const ErrorMessageBar: React.FC<ErrorMessageBarProps> = ({ errors }): JSX.Element => {
    const items = errors.map((error) => ({
        key: `error-${uuid()}`,
        problems: error,
    }))

    const columns: IColumn[] = [
        {
            key: 'problems',
            name: `Problems (${errors.length})`,
            fieldName: 'problems',
            minWidth: 300,
            maxWidth: 300,
            isResizable: true,
        },
    ]

    return (
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} className={classNames.wrapper}>
            <DetailsList
                compact
                items={items}
                columns={columns}
                checkboxVisibility={2}
                onRenderDetailsHeader={onRenderDetailsHeader}
            />
        </ScrollablePane>
    )
}
