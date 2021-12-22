import React, { useContext } from 'react'
import ImageFade from '@components/ImageFade'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/FlagImage.module.scss'
import { ReactComponent as UserIconSVG } from '@svgs/user-solid.svg'
import { ReactComponent as UsersIconSVG } from '@svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'

const FlagImage = (props: {
    type: 'space' | 'user' | 'post'
    size: number
    imagePath: string | null
    outline?: boolean
    shadow?: boolean
    fade?: boolean
    canEdit?: boolean
}): JSX.Element => {
    const { size, type, imagePath, outline, shadow, fade, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    let iconSVG
    let iconWidth
    if (type === 'space') {
        iconSVG = <UsersIconSVG />
        iconWidth = '60%'
    }
    if (type === 'user') {
        iconSVG = <UserIconSVG />
        iconWidth = '45%'
    }
    if (type === 'post') {
        iconSVG = <PostIconSVG />
        iconWidth = '50%'
    }

    function handleClick() {
        setImageUploadType(type === 'space' ? 'holon-flag-image' : 'user-flag-image')
        setImageUploadModalOpen(true)
    }

    const Placeholder = (): JSX.Element => {
        return (
            <div className={styles.placeholderWrapper}>
                <div className={styles.placeholderIcon} style={{ width: iconWidth }}>
                    {iconSVG}
                </div>
            </div>
        )
    }

    return (
        <div
            className={`${styles.wrapper} ${shadow && styles.shadow} ${outline && styles.outline} ${
                size < 50 && styles.small
            }`}
            style={{ width: size, height: size }}
        >
            {fade ? (
                <ImageFade imagePath={imagePath} speed={1000}>
                    {/* {imagePath ? <div className={styles.background} /> : <Placeholder />} */}
                    <Placeholder />
                </ImageFade>
            ) : (
                <>
                    {imagePath ? (
                        <>
                            <div className={styles.background} />
                            <img className={styles.flagImage} src={imagePath} alt='' />
                        </>
                    ) : (
                        <Placeholder />
                    )}
                </>
            )}
            {canEdit && (
                <button className={styles.uploadButton} type='button' onClick={handleClick}>
                    Upload new flag image
                </button>
            )}
        </div>
    )
}

FlagImage.defaultProps = {
    outline: false,
    shadow: false,
    fade: false,
    canEdit: false,
}

export default FlagImage
