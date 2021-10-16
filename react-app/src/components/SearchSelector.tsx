import React, { useState } from 'react'
import styles from '@styles/components/SearchSelector.module.scss'
import Input from '@components/Input'
import ImageTitle from '@components/ImageTitle'

// general purpose search selector:
// • text input fires onSearchQuery function
// • results fed back into option list via options prop
// • clicking an option passes the option to onOptionSelected function

// todo: add selectedOptions array and allowMultiple boolean?

const SearchSelector = (props: {
    type: 'space' | 'user'
    title?: string
    placeholder?: string
    state: 'default' | 'valid' | 'invalid'
    errors?: string[]
    options: any[]
    onSearchQuery: (payload: string) => void
    onOptionSelected: (payload: any) => void
    // selectedOptions: any[]
    // allowMultiple: boolean
}): JSX.Element => {
    const {
        type,
        title,
        placeholder,
        state,
        errors,
        options,
        onSearchQuery,
        onOptionSelected,
    } = props
    const [inputValue, setInputValue] = useState('')

    function handleSearchQuery(query) {
        setInputValue(query)
        onSearchQuery(query)
    }

    function selectOption(option) {
        onOptionSelected(option)
        setInputValue('')
    }

    return (
        <div className={styles.wrapper}>
            <Input
                type='text'
                title={title}
                placeholder={placeholder}
                state={state}
                errors={errors}
                value={inputValue}
                onChange={(newValue) => handleSearchQuery(newValue)}
            />
            {options.length ? (
                <div className={styles.dropDown}>
                    {options.map((option) => (
                        <ImageTitle
                            key={option.handle}
                            type={type}
                            imagePath={option.flagImagePath}
                            title={`${option.name} (${option.handle})`}
                            onClick={() => selectOption(option)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

SearchSelector.defaultProps = {
    title: null,
    placeholder: null,
    errors: null,
}

export default SearchSelector
