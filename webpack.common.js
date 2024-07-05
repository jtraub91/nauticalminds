const path = require('path');

module.exports = {
    entry: {
        index: "./src/index.js",
    },
    output: {
        "path": path.resolve(__dirname, "public", "build"),
        "filename": "nauticalminds.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/env",
                            "@babel/react",
                            "@babel/typescript"
                        ]
                    },
                },
            },
        ]
    }
};
