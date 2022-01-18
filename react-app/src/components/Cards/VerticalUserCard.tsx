import React from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/VerticalUserCard.module.scss'
import FlagImage from '@components/FlagImage'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import Row from '@components/Row'
import Column from '@components/Column'
import StatButton from '@components/StatButton'
import { ReactComponent as UsersIconSVG } from '@svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'
import { ReactComponent as CommentIconSVG } from '@svgs/comment-solid.svg'
import { ReactComponent as ReactionIconSVG } from '@svgs/fire-alt-solid.svg'
import { pluralise, statTitle } from '@src/Functions'

const VerticalUserCard = (props: { user: any; style?: any }): JSX.Element => {
    const { user, style } = props
    const { handle, name, bio, flagImagePath, coverImagePath, totalPosts, totalComments } = user

    const backgroundImage = coverImagePath
        ? `url(${coverImagePath})`
        : 'linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%'

    return (
        <Column spaceBetween className={styles.wrapper} style={style}>
            <Column centerX className={styles.content}>
                <div className={styles.coverImage} style={{ backgroundImage }} />
                <Link to={`/u/${handle}`}>
                    <FlagImage
                        className={styles.flagImage}
                        size={120}
                        type='user'
                        imagePath={flagImagePath}
                        outline
                        shadow
                    />
                </Link>
                <Column className={styles.textContent}>
                    <Link to={`/u/${handle}`}>
                        <h1>{name}</h1>
                        <h2>{`u/${handle}`}</h2>
                    </Link>
                    <ShowMoreLess height={75}>
                        <Markdown text={bio} />
                    </ShowMoreLess>
                </Column>
            </Column>
            <Row centerY centerX className={styles.footer}>
                <StatButton
                    icon={<PostIconSVG />}
                    text={totalPosts}
                    // text={`${totalPosts} Post${pluralise(totalPosts)}`}
                    title={statTitle('Post', totalPosts)}
                />
                <StatButton
                    icon={<CommentIconSVG />}
                    text={totalComments}
                    // text={`${totalComments} Comment${pluralise(totalComments)}`}
                    title={statTitle('Comment', totalComments)}
                />
            </Row>
        </Column>
    )
}

VerticalUserCard.defaultProps = {
    style: null,
}

export default VerticalUserCard
