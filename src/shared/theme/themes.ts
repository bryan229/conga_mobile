import { DefaultTheme } from '@react-navigation/native';
import { CPStyleProp } from '@services/types';

const symbol: { [key: string]: string } = {
    p: 'padding',
    m: 'margin',
    x: 'Horizontal',
    y: 'Vertical',
    r: 'Right',
    l: 'Left',
    t: 'Top',
    b: 'Bottom',
};

export const getStyle = (name: string | string[]): CPStyleProp => {
    const getSty = (value: string): any => {
        if (value === 'row') return { display: 'flex', flexDirection: 'row' };
        if (value === 'col') return { flex: 1 };
        if (value === 'align-items-center') return { alignItems: 'center' };
        if (value === 'align-items-end') return { alignItems: 'flex-end' };
        if (value === 'justify-center') return { justifyContent: 'center' };
        if (value === 'justify-between') return { justifyContent: 'space-between' };
        if (value === 'justify-around') return { justifyContent: 'space-around' };
        if (value === 'justify-end') return { justifyContent: 'flex-end' };
        if (value === 'shrink-0') return { flexShrink: 0 };
        if (value === 'flex-wrap') return { flexWrap: 'wrap' };
        if (value === 'capitalize') return { textTransform: 'capitalize' };
        const nameArray = value.split('-');
        if (nameArray.length !== 2) return {};
        const styleKey = `${symbol[nameArray[0][0]]}${nameArray[0].length > 1 ? symbol[nameArray[0][1]] : ''}`;
        return { [styleKey]: Number(nameArray[1]) };
    };
    if (typeof name === 'string') {
        return getSty(name);
    } else {
        return name.reduce((styles, value) => {
            return { ...styles, ...getSty(value) };
        }, {});
    }
};

export const palette = {
    primary: '#059669',
    lightPrimary: '#defff5',
    darkPrimary: '#457566',
    disablePrimary: '#85a89d',
    dynamicPrimary: '#059669',
    secondary: '#ff6a00',
    background: '#f6f8fa',
    disableBackground: '#f2f4f5',
    darkDisableBackground: '#444',
    white: '#fff',
    black: '#101214',
    buttonText: '#fff',
    shadow: '#757575',
    text: '#30363b',
    borderColor: '#d0d7de',
    borderColorDark: '#333942',
    ctrlBorderColor: '#d0d7d0',
    placeholder: '#a1a1a1',
    danger: '#d0021b',
    title: '#666666',
    separator: '#eee',
    highlight: '#c7c6cb',
    blackOverlay: 'rgba(0,0,0,0.1)',
    dynamicWhite: '#fff',
    dynamicBlack: '#1c1e21',
    dynamicBackground: '#fff',
    transparent: 'transparent',
    calpyse: '#2b7488',
    tabBar: 'white',
    headBar: 'white',
    iconPrimary: '#059669',
    iconWhite: '#fff',
    iconBlack: '#101214',
    darkGray: '#777',
    purple: '#970BD9',
};

export const LightTheme = {
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        ...palette,
    },
    getStyle: getStyle,
};

export const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...LightTheme.colors,
        background: palette.black,
        disableBackground: palette.darkDisableBackground,
        foreground: palette.white,
        text: palette.white,
        tabBar: palette.black,
        headBar: palette.black,
        iconWhite: palette.black,
        iconBlack: palette.white,
        dynamicBackground: palette.dynamicBlack,
        shadow: palette.transparent,
        borderColor: palette.borderColorDark,
        iconPrimary: palette.white,
        separator: palette.blackOverlay,
        dynamicWhite: palette.dynamicBlack,
        dynamicBlack: palette.dynamicWhite,
        dynamicPrimary: 'black',
        purple: palette.purple,
    },
    getStyle: getStyle,
};
