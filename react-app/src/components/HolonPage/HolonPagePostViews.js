import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostViews() {
    const {
        holonPostView, setHolonPostView
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Layout'
                options={['List', 'Map']}
                selectedOption={holonPostView}
                setSelectedOption={setHolonPostView}
            />
        </div>
    )
}

export default HolonPagePostViews
