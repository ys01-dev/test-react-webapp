import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { Member } from './Member'

const targetUrl = "http://localhost:4000/get"

const HttpTest = () => {
    const [members, setMembers] = React.useState<Member[]>([])

    const onButtonClick = async () => {
        const response = await axios.get(targetUrl)
        setMembers(response.data)
    }

    return (
        <div>
            <button onClick={onButtonClick}>push</button>
            {members.length !== 0 && (
                <ul>
                    {members.map((member) =>
                        <li key={member.number}>
                            {`id=${member.number}    name=${member.name}`}
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}

export default HttpTest