import React from 'react'
import styles from '../styles/components/HolonTag.module.scss'

function HolonTag(props) {
    const { holonTag, added, addSuggestedHolonTag, removeHolonTag } = props
    return (
        <>
            {/* Suggested holonTags */}
            {!added && <div className={styles.suggestedHolonTag} onClick={() => addSuggestedHolonTag(holonTag)}>
                <div className={styles.tagText}>{ holonTag.handle }</div>
            </div>}

            {/* Added holonTags */}
            {added && <div className={styles.addedHolonTag}>
                <div className={styles.tagText}>{ holonTag.handle }</div>
                <div className={styles.holonTagCloseIcon} onClick={() => removeHolonTag(holonTag)}></div>
            </div>}
        </>
    )
}

export default HolonTag
