const path = require('path');

module.exports = {
    entry: {
        index: "./src/index.js",
    },
    output: {
        "path": path.resolve(__dirname, "app", "static", "dist"),
        "filename": "nauticalminds.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/env",
                            "@babel/react"
                        ]
                    },
                },
            },
        ]
    }
};
