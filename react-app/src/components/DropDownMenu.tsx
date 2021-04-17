import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/components/DropDownMenu.module.scss'
import CloseOnClickOutside from './CloseOnClickOutside'

const DropDownMenu = (props: {
    title: string
    options: any[]
    selectedOption: string | number
    setSelectedOption: any
    orientation: string
}): JSX.Element => {
    const { title, options, selectedOption, setSelectedOption, orientation } = props
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div
            className={`${styles.dropDownMenu} ${
                orientation === 'horizontal' && styles.horizontal
            }`}
        >
            <span className={styles.title}>{title.toUpperCase()}</span>
            <CloseOnClickOutside onClick={() => setMenuOpen(false)}>
                <div className={styles.dropDown}>
                    <div
                        className={styles.selectedOption}
                        role='button'
                        tabIndex={0}
                        onClick={() => setMenuOpen(!menuOpen)}
                        onKeyDown={() => setMenuOpen(!menuOpen)}
                    >
                        {selectedOption}
                        <img
                            className={styles.icon}
                            src='/icons/sort-down-solid.svg'
                            aria-label='drop-down'
                        />
                    </div>
                    <div className={`${styles.options} ${menuOpen && styles.visible}`}>
                        {options.map((option) => (
                            <div
                                className={styles.option}
                                key={option}
                                role='button'
                                tabIndex={0}
                                onClick={() => {
                                    setSelectedOption(option)
                                    setMenuOpen(false)
                                }}
                                onKeyDown={() => {
                                    setSelectedOption(option)
                                    setMenuOpen(false)
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default DropDownMenu
