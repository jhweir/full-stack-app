import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePageSideBarRight.module.scss'
// import SpacePageSideBarRightPlaceholder from '@components/SpacePage/SpacePageSideBarRightPlaceholder'
import Column from '@components/Column'
import Row from '@components/Row'
import ImageTitle from '@components/ImageTitle'
// import { ReactComponent as ArrowUpIconSVG } from '@svgs/arrow-up-solid.svg'
// import { ReactComponent as ArrowDownIconSVG } from '@svgs/arrow-down-solid.svg'
import { ReactComponent as ArrowUpIconSVG } from '@svgs/chevron-up-solid.svg'
import { ReactComponent as ArrowDownIconSVG } from '@svgs/chevron-down-solid.svg'

const SpacePageSideBarRight = (): JSX.Element => {
    const { spaceData, selectedSpaceSubPage } = useContext(SpaceContext)
    const { DirectParentHolons: parentSpaces, DirectChildHolons: childSpaces } = spaceData

    return (
        <div className={`${styles.sideBarRight} hide-scrollbars`}>
            {parentSpaces && parentSpaces.length > 0 && (
                <Column style={{ marginBottom: 20 }}>
                    <Row>
                        <ArrowUpIconSVG />
                        <p>Parent spaces</p>
                    </Row>
                    <Column scroll>
                        {parentSpaces.map((space) => (
                            <ImageTitle
                                key={space.id}
                                type='space'
                                imagePath={space.flagImagePath}
                                title={space.name}
                                link={`/s/${space.handle}/${selectedSpaceSubPage}`}
                                fontSize={16}
                                imageSize={40}
                                style={{ marginBottom: 10 }}
                            />
                        ))}
                    </Column>
                </Column>
            )}
            {childSpaces && childSpaces.length > 0 && (
                <Column style={{ maxHeight: 600 }}>
                    <Row>
                        <ArrowDownIconSVG />
                        <p>Child spaces</p>
                    </Row>
                    <Column scroll>
                        {childSpaces.map((space) => (
                            <ImageTitle
                                key={space.id}
                                type='space'
                                imagePath={space.flagImagePath}
                                title={space.name}
                                link={`/s/${space.handle}/${selectedSpaceSubPage}`}
                                fontSize={16}
                                imageSize={40}
                                style={{ marginBottom: 10 }}
                            />
                        ))}
                    </Column>
                </Column>
            )}
        </div>
    )
}

export default SpacePageSideBarRight
