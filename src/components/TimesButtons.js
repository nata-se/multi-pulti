import classNames from 'classnames'
import React, { useState, useEffect } from 'react'

const numbers = [ 2, 3, 4, 5, 6, 7, 8, 9]

const TimesButtons = ({ setMultipliers, multipliers }) => {
    const [checked, setChecked] = useState(multipliers)

    const handleCheck = (e, index) => {                
        const newChecked = checked && checked.includes(index)
            ? checked.filter(el => el !== index)
            : [...checked, index]
        setChecked(newChecked)
        setMultipliers(newChecked)
  
    }

    return(
        <>
        <div className='menu'>
            {
                numbers.map((el, i) => {
                    const className = classNames('menu_items', {
                        checked: checked.includes(i+2),
                    })

                    return(
                        <div key={i+2} id={i+2} className={className} onClick={(e) => handleCheck(e,i+2)}>Times {el}</div>
                    )
                })
            }
        </div>
            
        </>
    )

}
export default TimesButtons

