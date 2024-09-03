module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            "module-resolver",
            {
              "root": ["./src"],
              "extensions": [".android.js", ".js", ".jsx", ".ts", ".tsx"],
              "alias": {
                '@screens': './src/screens',
                '@services': './src/services',
                '@shared': './src/shared',
                '@utils': './src/utils',
                '@store': './src/store',
                '@navigation': './src/navigation',
              },
            }
        ],
        [
            'module:react-native-dotenv',
            {
                envName: 'APP_ENV',
                moduleName: '@env',
                path: '.env',
                safe: false,
                allowUndefined: true,
                verbose: false,
            },
        ],
        'react-native-reanimated/plugin',
    ],
};
