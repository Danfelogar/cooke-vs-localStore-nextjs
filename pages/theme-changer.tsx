import { ChangeEvent, FC, MouseEventHandler, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

import { Layout } from '../components/layouts/Layout';

interface Props {
    theme: string;
}

const ThemeChangerPage:FC<Props> = ( {theme} ) => {

    // console.log({theme})

    const [currentTheme, setCurrentTheme] = useState('light');

    const handleThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedTheme = event.target.value;

        setCurrentTheme(selectedTheme);

        localStorage.setItem('theme', selectedTheme);
        Cookies.set('theme', selectedTheme);

    };

    const onClick = async() => {
        const { data } = await axios.get('/api/hello');
        console.log({data});
    }

    useEffect(() => {
        //esto llama a las cookies sin necesidad de depender del servidor
        console.log('LocalStorage: ', localStorage.getItem('theme'));
        console.log('Cookies: ', Cookies.get('theme'));

        //setCurrentTheme( theme );

    }, []);

    return (
        <Layout>
            <Card>
                <CardContent>
                    <FormControl>
                        <FormLabel>Theme</FormLabel>
                        <RadioGroup
                            value={ currentTheme }
                            onChange={ handleThemeChange }
                        >
                            <FormControlLabel value="light" control={ <Radio /> } label='Light' />
                            <FormControlLabel value="dark" control={ <Radio /> } label='Dark' />
                            <FormControlLabel value="custom" control={ <Radio /> } label='Custom' />
                        </RadioGroup>
                    </FormControl>

                    <Button
                        onClick={onClick}
                    >
                        Request
                    </Button>
                </CardContent>
            </Card>
        </Layout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const { theme = 'light', name='Some one' } = req.cookies;

    const validThemes = ['light', 'dark', 'custom'];

    return {
        props: {
            theme: validThemes.includes( theme ) ? theme : 'dark',
            name,
        }
    }
}

export default ThemeChangerPage;