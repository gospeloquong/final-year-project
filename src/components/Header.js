import { Card, Text } from '@mantine/core';
import React from 'react';

function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div>
            <Card
                shadow='md'
                p={20}
                withBorder
            >
                <div className='flex justify-between'>
                    <Text
                        size={'xl'}
                        color="yellow"
                        variant='text'
                        weight={'bold'}
                    >
                        EXPENSE TRACKER
                    </Text>
                    <Text>
                        {user?.name}
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default Header