module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        '@babel/plugin-transform-export-namespace-from',
        'react-native-reanimated/plugin',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    // This has to be mirrored in tsconfig.json
                    '^@/(.+)': './src/\\1',
                    components: './src/components',
                    providers: './src/providers',
                    theme: './src/theme',
                    store: './src/store',
                    services: './src/services',
                    routes: './src/routes',
                    screens: './src/screens',
                    utils: './src/utils',
                    types: './src/types',
                    assets: './src/assets',
                    hooks: './src/hooks',
                },
            },
        ],
    ],
};
