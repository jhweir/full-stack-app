import React, { useState } from 'react'
import styles from '@styles/components/SearchSelector.module.scss'
import Input from '@components/Input'
import ImageTitle from '@components/ImageTitle'
import Row from '@components/Row'

// general purpose search selector:
// • text input fires onSearchQuery function
// • results fed back into option list via options prop
// • clicking an option passes the option to onOptionSelected function

// todo: add selectedOptions array and allowMultiple boolean?

const SearchSelector = (props: {
    type: 'space' | 'user' | 'topic'
    title?: string
    placeholder?: string
    margin?: string
    disabled?: boolean
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
        margin,
        disabled,
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
        <div className={styles.wrapper} style={{ margin }}>
            <Input
                type='text'
                title={title}
                placeholder={placeholder}
                disabled={disabled}
                state={state}
                errors={errors}
                value={inputValue}
                onChange={(newValue) => handleSearchQuery(newValue)}
            />
            {options.length > 0 && (
                <div className={styles.dropDown}>
                    {type === 'topic'
                        ? options.map((option) => (
                              <button
                                  className={styles.topic}
                                  type='button'
                                  onClick={() => selectOption(option)}
                              >
                                  <div>
                                      <option.icon />
                                  </div>
                                  <p>{option.name}</p>
                              </button>
                          ))
                        : options.map((option) => (
                              <ImageTitle
                                  key={option.handle}
                                  type={type}
                                  imagePath={option.flagImagePath}
                                  title={`${option.name} (${option.handle})`}
                                  onClick={() => selectOption(option)}
                              />
                          ))}
                </div>
            )}
        </div>
    )
}

SearchSelector.defaultProps = {
    title: null,
    placeholder: null,
    margin: null,
    disabled: false,
    errors: null,
}

export default SearchSelector
