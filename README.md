# Project Manager

### Usage

```bash
npx pm-gui # [--port=4000] [--db=path/to/sqlite/db]
```

open browser and visit `http://localhost:4000`

### IPC

add [project-manager-ipc](https://www.npmjs.com/package/project-manager-ipc) to project for
emit dev info and build dist to pm-gui

```ts
import ProjectManagerIpc from "project-manager-ipc";
const ipc = new ProjectManagerIpc();
ipc.connect();

// Run Dev
YourDevScript(() => {
  ipc.emitUrl("0.0.0.0", 1234);
});
// Build Success
YourBuildScript(() => {
  ipc.emitDist("path/to/dist");
});
```

or use [project-manager-webpack-plugin](https://www.npmjs.com/package/project-manager-webpack-plugin) to auto emit dist with webpack

```ts
import ProjectManagerWebpackPlugin from "project-manager-webpack-plugin";

const webpackConfig = {
  //...
  plugins: [
    new ProjectManagerWebpackPlugin({
      // send dev host and port
      devInfo: () => ({
        host: "0.0.0.0",
        port: 1234,
      }),
      // outpath will be auto emit
    }),
  ],
};
```

### Demo

![image](./docs/main.png)

### changelog

#### [1.0.3] 2023-05-05

- update db file save method

#### [1.0.4] 2023-05-06

- merge project devInfo request
- show cpu/memory on homepage
