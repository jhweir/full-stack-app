import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRatingModal.module.scss'
import SpaceInput from '../../SpaceInput'
import CloseButton from '../../CloseButton'
import ImageTitleLink from '../../ImageTitleLink'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardRatingModal(props) {
    const {
        postData, ratings,
        setRatingModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalRatings, setTotalRatings,
        totalRatingPoints, setTotalRatingPoints,
        accountRating, setAccountRating,
        blockedSpaces, setBlockedSpaces
    } = props

    const { accountData } = useContext(AccountContext)
    const { setHolonHandle, holonData } = useContext(HolonContext)

    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)

    function totalRatingScore() {
        if (totalRatings) { return (totalRatingPoints / totalRatings).toFixed(2) + '%' }
        else { return 'N/A' }
    }

    function addRating() {
        console.log('addRating')
        const invalidRating = isNaN(newRating) || newRating === '' || newRating > 100 || newRating < 0
        if (invalidRating) { setNewRatingError(true) }
        else {
            setTotalRatings(totalRatings + 1)
            setTotalReactions(totalReactions + 1)
            setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
            setAccountRating(accountRating + 1)
            axios.put(config.environmentURL + '/add-rating', { accountId: accountData.id, postId: postData.id, holonId: holonData.id, newRating })
                .then(setNewRating(''))
                .catch(error => { console.log(error) })
        }
    }

    function removeRating() {
        console.log('removeRating')
        setTotalRatings(totalRatings - 1)
        setTotalReactions(totalReactions - 1)
        setAccountRating(0)
        axios.put(config.environmentURL + '/remove-rating', { accountId: accountData.id, postId: postData.id, holonId: holonData.id })
            //.then(() => { getHolonPosts() })
            .catch(error => { console.log(error) })
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <CloseButton onClick={() => setRatingModalOpen(false)}/>
                <span className={styles.title}>Ratings</span>
                {ratings.length < 1
                    ? <span className={`${styles.text} mb-20`}><i>No ratings yet...</i></span>
                    : <div className={styles.ratings}>
                        {ratings.map((rating, index) =>
                            <div className={styles.rating} key={index}>
                                <ImageTitleLink
                                    type={'user'}
                                    imagePath={rating.creator.flagImagePath}
                                    title={rating.creator.name}
                                    link={`/u/${rating.creator.handle}`}
                                />
                                <div className={styles.totalScoreBar}>
                                    <div className={styles.totalScorePercentage} style={{width: `${rating.value}%`}}/>
                                    <div className={styles.totalScoreText}>{`${rating.value}%`}</div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                {/* <span className={`${styles.text} mb-20`}>
                    Repost {postData.creator.name}'s post{ratings.length > 0 && ' somewhere else'}:
                </span> */}
                <div className='wecoButton' onClick={addRating}>Add Rating</div>
            </div>
        </div>
    )
}

export default PostCardRatingModal


// import React from 'react'
// import styles from '../../../styles/components/PostCardRatingModal.module.scss'

// function PostCardRatingModal(props) {
//     const {
//         isLoggedIn,
//         totalRatings,
//         totalRatingPoints,
//         newRating,
//         newRatingError,
//         setNewRating,
//         setNewRatingError,
//         addRating,
//         removeRating,
//         accountRating
//     } = props

//     const alreadyRatedByUser = accountRating !== 0

//     function totalRatingScore() {
//         if (totalRatings) { return (totalRatingPoints / totalRatings).toFixed(2) + '%' }
//         else { return 'N/A' }
//     }

//     console.log('totalRatingScore: ', totalRatingScore)
//     return (
//         <div className={styles.postCardRatingModal}>
//             <div className={styles.totalScore}>
//                 <div className={styles.totalScoreBar}>
//                     <div className={styles.totalScorePercentage} style={{width: totalRatings ? totalRatingScore() : 0}}/>
//                     <div className={styles.totalScoreText}>{ totalRatingScore() }</div>
//                 </div>
//             </div>
//             {isLoggedIn && !alreadyRatedByUser &&
//                 <>
//                     <div className={styles.inputWrapper}>
//                         <input className={`${styles.input} ${newRatingError && styles.error}`}
//                             value={newRating} type="text"
//                             onChange={(e) => { setNewRating(e.target.value); setNewRatingError(false) }}
//                         />
//                         <div>/ 100</div>
//                     </div>
//                     <div className='wecoButton' style={{height: 30}} onClick={() => { addRating() }}>Add</div>
//                 </>
//             }
//             {isLoggedIn && alreadyRatedByUser && <div className='wecoButton' style={{height: 30}} onClick={() => { removeRating() }}>Remove</div>}
//         </div>
//     )
// }

// export default PostCardRatingModal