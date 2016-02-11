# Build tools for [webgl-starter] and [webaudio-starter]

## Installation

[Node.js] 5.x, [npm] and [gulp] have to be installed.

### Windows

1. Download v5.x.x or later release of Node.js from [Node.js homepage][Node.js]. It includes npm.

2. If you want to use shorter command-line instructions for building, run with Administrator privileges (for example, by opening a console as Administrator) the following commands:
```
npm install --global gulp-cli
```

## Building

### If gulp is installed globally for shorter commands

```
npm install
gulp
```

### If gulp is not installed globally

```
npm install
npm run gulp
```

## Extra commands

* `gulp watch` or `npm run gulp -- watch` to automatically rebuild when source code is changed

[webgl-starter]: https://github.com/AntonKhorev/webgl-starter
[webaudio-starter]: https://github.com/AntonKhorev/webaudio-starter
[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[gulp]: http://gulpjs.com/
