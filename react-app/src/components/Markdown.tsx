import React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import styles from '../styles/components/Markdown.module.scss'

const Markdown = (props: { text: string }): JSX.Element => {
    const { text } = props
    return (
        <div className={styles.markdown}>
            <ReactMarkdown plugins={[gfm]}>{text}</ReactMarkdown>
        </div>
    )
}

export default Markdown
