## webpack plugin for project-manager

send webpack dev url and outpath to project-manager

### Install

```bash
npm install project-manager-webpack-plugin --save-dev
```

### Usage

```ts
import ProjectManagerWebpackPlugin from "project-manager-webpack-plugin";

const webpackConfig = {
  //...
  plugins: [
    new ProjectManagerWebpackPlugin({
      // send dev host and port
      devInfo: () => ({
        host: "0.0.0.0",
        port: 3000,
      }),
    }),
  ],
};
```

### Changelog

2023-04-14 v1.0.7 support custom server id
