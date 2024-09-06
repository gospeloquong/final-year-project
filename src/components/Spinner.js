import React from 'react'
import { Loader } from '@mantine/core';

function Spinner() {
    return (
        <div>
            <Loader variant="bars"
             size='lg' />
        </div>
    )
}

export default Spinner