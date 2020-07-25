import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/components/DropDownMenu.module.scss'

function DropDownMenu(props) {
    const { title, options, selectedOption, setSelectedOption } = props
    const [menuOpen, setMenuOpen] = useState(false)

    // close menu if user clicks outside ref
    const ref = useRef()
    function handleClickOutside(e) { if (!ref.current.contains(e.target)) { setMenuOpen(false) } }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.dropDownMenu}>
            <span className={styles.title}>{title.toUpperCase()}</span>
            <div ref={ref}>
                <div className={styles.selectedOption} onClick={() => setMenuOpen(!menuOpen)}>
                    {selectedOption}
                    <img className={styles.icon} src='/icons/sort-down-solid.svg'/>
                </div>
                <div className={`${styles.options} ${menuOpen && styles.visible}`}>
                    {options.map((option, index) => 
                        <div className={styles.option} key={index} onClick={() => { 
                            setSelectedOption(option)
                            setMenuOpen(false)
                        }}>{option}</div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default DropDownMenu
