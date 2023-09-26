
import React from 'react'
import './Component2.css'

interface IComponent2 {
    id: number,
name: string,
active: boolean,
dateOfBirth: Date,
order: number,
image: string,
elements: React.ReactNode
} 

const Component2 = ({
    id,
name,
active,
dateOfBirth,
order,
image,
elements
    }: IComponent2): React.JSX.Element => {
    return (
        <div className={`component2`}>
        </div>
    )
}

export default Component2
