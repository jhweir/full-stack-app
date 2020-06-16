import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/PollResultsFilters.module.scss'

function PollResultsFilters(props) {
    const { pageUrl } = props
    const [dropDownOpen, setDropDownOpen] = useState(false)
    
    return (
        <div className={styles.pollResultsFilters}>
            <button className="button mb-10" onClick={() => setDropDownOpen(!dropDownOpen)}>Display settings</button>
            {dropDownOpen && 
                <div className={styles.dropDownContent}>
                    <Link 
                        className={styles.dropDownItem}
                        to={ `${pageUrl}/results?display=pie-chart` }>
                        Pie Chart
                    </Link>
                    <Link 
                        className={styles.dropDownItem}
                        to={ `${pageUrl}/results?display=time-graph` }>
                        Time Graph
                    </Link>
                </div>
            }
        </div>
    )
}

export default PollResultsFilters