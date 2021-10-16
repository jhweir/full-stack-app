import React, { useState } from 'react'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/ParentSpaceSelector.module.scss'
import Input from '@components/Input'
import ImageTitle from '@components/ImageTitle'

const ParentSpaceSelector = (props: {
    spaceId: number
    title?: string
    onClick: (payload: any) => void
}): JSX.Element => {
    const { spaceId, title, onClick } = props
    const [searchQuery, setSearchQuery] = useState('')
    const [options, setOptions] = useState<any[]>([])

    // todo: get blacklist first and save to state

    function handleNewSearchQuery(newSearchQuery) {
        setSearchQuery(newSearchQuery)
        // if empty search query, reset options
        if (newSearchQuery.length < 1) setOptions([])
        else {
            // request options from db
            axios
                .get(
                    `${config.apiURL}/viable-parent-spaces?spaceId=${spaceId}&searchQuery=${newSearchQuery}`
                )
                .then((res) => setOptions(res.data))
                .catch((error) => console.log(error))
        }
    }

    function setSelectedOption(option) {
        onClick(option)
        setSearchQuery('')
        setOptions([])
    }

    return (
        // <SearchSelector
        //     type='space'
        //     title='Search for the new parent spaces name or handle below'
        //     placeholder='name or handle...'
        //     onSearchQuery={(newQuery) => handleSearchQuery(newQuery)}
        //     onOptionSelected={(space) => setSelectedUser(space)}
        //     options={}
        //     // selectedOptions={}
        //     // allowMultiple={false}
        // />
        <div className={styles.wrapper}>
            <Input
                type='text'
                title={title}
                placeholder='name or handle...'
                state='default'
                value={searchQuery}
                onChange={(newSearchQuery) => handleNewSearchQuery(newSearchQuery)}
            />
            {options.length ? (
                <div className={styles.dropDown}>
                    {options.map((option) => (
                        <ImageTitle
                            key={option.handle}
                            type='space'
                            imagePath={option.flagImagePath}
                            title={`${option.name} (${option.handle})`}
                            onClick={() => setSelectedOption(option)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

ParentSpaceSelector.defaultProps = {
    title: '',
}

export default ParentSpaceSelector
