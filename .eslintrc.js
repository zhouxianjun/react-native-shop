module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "globals": {
        "__DEV__": true,
        "isIos": true,
        "isAndroid": true,
        "isIphoneX": true,
        "SCREEN_WIDTH": true,
        "SCREEN_HEIGHT": true
    },
    "parser": "babel-eslint",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
        "comma-dangle": ["error", "never"],
        "react/jsx-one-expression-per-line": 0,
        "react/forbid-prop-types": 0,
        "max-len": 0,
        "space-before-function-paren": ["error", "always"],
        "no-return-assign": 0,
        "no-console": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};