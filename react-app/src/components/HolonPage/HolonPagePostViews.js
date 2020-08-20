import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostViews() {
    const {
        holonPostViewLayout, setHolonPostViewLayout
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Layout'
                options={['List', 'Map']}
                selectedOption={holonPostViewLayout}
                setSelectedOption={setHolonPostViewLayout}
            />
        </div>
    )
}

export default HolonPagePostViews
