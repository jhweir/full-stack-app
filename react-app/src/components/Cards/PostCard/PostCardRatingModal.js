import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRatingModal.module.scss'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardRatingModal(props) {
    const {
        postData,
        ratings,
        setRatingModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalRatings, setTotalRatings,
        totalRatingPoints, setTotalRatingPoints,
        accountRating, setAccountRating
    } = props

    const { accountData } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)

    function averageScore() {
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
            axios.post(config.environmentURL + '/add-rating', { accountId: accountData.id, postId: postData.id, holonId: holonData.id, newRating })
                .then(res => {
                    if (res.data === 'success') {
                        setNewRating('')
                        setTimeout(() => getReactionData(), 200)
                    } 
                })
                .catch(error => { console.log(error) })
        }
    }

    console.log('ratings: ', ratings)

    function newTotalRatingPoints() {
        var oldAccountRating = ratings.filter(rating => rating.creator.handle === accountData.handle)[0]
        // console.log('oldAccountRating: ', oldAccountRating)
        return totalRatingPoints - oldAccountRating.value
    }

    function removeRating() {
        console.log('removeRating')
        setTotalRatings(totalRatings - 1)
        setTotalReactions(totalReactions - 1)
        setTotalRatingPoints(newTotalRatingPoints())
        setAccountRating(0)
        axios.post(config.environmentURL + '/remove-rating', { accountId: accountData.id, postId: postData.id, holonId: holonData.id })
            .then(res => {
                if (res.data === 'success') {
                    setTimeout(() => getReactionData(), 200)
                }
            })
            .catch(error => { console.log(error) })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setRatingModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setRatingModalOpen(false)}/>
                <span className={styles.title}>Ratings</span>
                {!ratings.length
                    ? <span className={`${styles.text} mb-20`}><i>No ratings yet...</i></span>
                    : <div className={styles.ratings}>
                        <div className={`${styles.rating} ${styles.averageScore}`}>
                            <span className={`${styles.text} mr-10`}>Average score:</span>
                            <div className={styles.totalScoreBar}>
                                <div className={styles.averageScorePercentage} style={{width: totalReactions ? averageScore() : 0}}/>
                                <div className={styles.totalScoreText}>{ averageScore() }</div>
                            </div>
                        </div>
                        {ratings.map((rating, index) =>
                            <div className={styles.rating} key={index}>
                                <Link className={styles.imageTextLink} to={`/u/${rating.creator.handle}`}>
                                    <SmallFlagImage type='user' size={30} imagePath={rating.creator.flagImagePath}/>
                                    <span className={`${styles.text} ml-5`}>{rating.creator.name}</span>
                                </Link>
                                <div className={styles.totalScoreBar}>
                                    <div className={styles.totalScorePercentage} style={{width: `${rating.value}%`}}/>
                                    <div className={styles.totalScoreText}>{`${rating.value}%`}</div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                {accountRating < 1
                    ? <div className={styles.inputWrapper}>
                        <input className={`wecoInput mr-10 ${newRatingError && 'error'}`} style={{width: 40, padding: "0 10px", fontSize: 16}}
                            value={newRating} type="text"
                            onChange={(e) => { setNewRating(e.target.value); setNewRatingError(false) }}
                        />
                        <div className='mr-10'>/ 100</div>
                        <div className='wecoButton' onClick={addRating}>Add Rating</div>
                    </div>
                    : <div className='wecoButton' onClick={removeRating}>Remove Rating</div>
                }
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

//     function averageScore() {
//         if (totalRatings) { return (totalRatingPoints / totalRatings).toFixed(2) + '%' }
//         else { return 'N/A' }
//     }

//     console.log('averageScore: ', averageScore)
//     return (
//         <div className={styles.postCardRatingModal}>
//             <div className={styles.totalScore}>
//                 <div className={styles.totalScoreBar}>
//                     <div className={styles.totalScorePercentage} style={{width: totalRatings ? averageScore() : 0}}/>
//                     <div className={styles.totalScoreText}>{ averageScore() }</div>
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