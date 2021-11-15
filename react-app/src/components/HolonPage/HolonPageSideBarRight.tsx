import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/HolonPageSideBarRight.module.scss'
// import HolonPageSideBarRightPlaceholder from '@components/HolonPage/HolonPageSideBarRightPlaceholder'
import Column from '@components/Column'
import Row from '@components/Row'
import ImageTitle from '@components/ImageTitle'
// import { ReactComponent as ArrowUpIconSVG } from '@svgs/arrow-up-solid.svg'
// import { ReactComponent as ArrowDownIconSVG } from '@svgs/arrow-down-solid.svg'
import { ReactComponent as ArrowUpIconSVG } from '@svgs/chevron-up-solid.svg'
import { ReactComponent as ArrowDownIconSVG } from '@svgs/chevron-down-solid.svg'

const HolonPageSideBarRight = (): JSX.Element => {
    const { spaceData, selectedSpaceSubPage } = useContext(SpaceContext)
    const { DirectParentHolons: parentSpaces, DirectChildHolons: childSpaces } = spaceData

    return (
        <div className={`${styles.sideBarRight} hide-scrollbars`}>
            {parentSpaces && parentSpaces.length > 0 && (
                <Column margin='0 0 20px 0'>
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
                                margin='0 0 10px 0'
                            />
                        ))}
                    </Column>
                </Column>
            )}
            {childSpaces && childSpaces.length > 0 && (
                <Column maxHeight={600}>
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
                                margin='0 0 10px 0'
                            />
                        ))}
                    </Column>
                </Column>
            )}
        </div>
    )
}

export default HolonPageSideBarRight
