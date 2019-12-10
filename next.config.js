import { config } from "dotenv";
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
config();

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

module.exports = withCSS({
  webpack: config => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
