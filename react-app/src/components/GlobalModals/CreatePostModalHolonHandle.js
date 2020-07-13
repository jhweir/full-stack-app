import React from 'react'
import styles from '../../styles/components/CreatePostModalHolonHandle.module.scss'

function CreatePostModalHolonHandle(props) {
    const { holonHandle, added, addSuggestedHolonHandle, removeHolonHandle } = props
    return (
        <>
            {/* Suggested holonHandles */}
            {!added && <div className={styles.suggestedHolonHandle} onClick={() => addSuggestedHolonHandle(holonHandle)}>
                <div className={styles.handleText}>{ holonHandle }</div>
            </div>}

            {/* Added holonHandles */}
            {added && <div className={styles.addedHolonHandle}>
                <div className={styles.handleText}>{ holonHandle }</div>
                <div className={styles.holonHandleCloseIcon} onClick={() => removeHolonHandle(holonHandle)}></div>
            </div>}
        </>
    )
}

export default CreatePostModalHolonHandle
