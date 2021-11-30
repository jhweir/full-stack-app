import React, { useState } from 'react'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/UserSelector.module.scss'
import Input from '@components/Input'
import ImageTitle from '@components/ImageTitle'

const UserSelector = (props: {
    title: string
    whitelist?: any[]
    blacklist?: any[]
    onClick: (payload: any) => void
}): JSX.Element => {
    const { title, whitelist, blacklist, onClick } = props
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState<any[]>([])

    function filterOptions(newSearchQuery) {
        if (whitelist) {
            return whitelist.filter(
                (user) =>
                    user.handle.includes(newSearchQuery.toLowerCase()) ||
                    user.name.toLowerCase().includes(newSearchQuery.toLowerCase())
            )
        }
        return []
    }

    function handleNewSearchQuery(newSearchQuery) {
        setSearchQuery(newSearchQuery)
        // if empty search query, reset users
        if (newSearchQuery.length < 1) setUsers([])
        else if (whitelist) {
            // if whitelist, show whitelisted users filtered by query
            setUsers(filterOptions(newSearchQuery))
        } else {
            // else request non-blacklisted users from db
            axios
                .post(`${config.apiURL}/find-user`, {
                    searchQuery: newSearchQuery,
                    blacklist,
                })
                .then((res) => setUsers(res.data))
                .catch((error) => console.log('error: ', error))
        }
    }

    function selectUser(user) {
        onClick(user)
        setSearchQuery('')
        setUsers([])
    }

    return (
        <div className={styles.wrapper}>
            <Input
                type='text'
                title={title}
                placeholder='user name or handle...'
                value={searchQuery}
                onChange={(newSearchQuery) => handleNewSearchQuery(newSearchQuery)}
            />
            {users.length ? (
                <div className={styles.dropDown}>
                    {users.map((user) => (
                        <ImageTitle
                            key={user.handle}
                            type='user'
                            imagePath={user.flagImagePath}
                            title={`${user.name} (${user.handle})`}
                            onClick={() => selectUser(user)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

UserSelector.defaultProps = {
    whitelist: null,
    blacklist: null,
}

export default UserSelector
