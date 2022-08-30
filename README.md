# WhatsApp bot template

This is a template for creating WhatsApp bots.

This template will help you start a WhatsApp bot without needing to worry about any configuration.

## 📋 Prerequisites

-   [**Node.js**](https://nodejs.org): You need to have Node.js installed on your computer to run this bot. You can download it [here](https://nodejs.org/en/download).

## Available Scripts

In the project directory, you can run:

### `yarn` or `npm i`

Installs every dependency needed for the project.

### `yarn start` or `npm start`

Runs the app in the development mode.\
The app will reload every time you save a file.

You will also see any lint errors/warnings in the console.

> _`yarn dev` and `npm run dev` do the same._

### `yarn prod` or `npm run prod`

Runs the app in the production mode.

Before running the app, it will run the linter, format code with Prettier, and build the project.

### `yarn build` or `npm run build`

Builds the app for production to the `build` folder.

Your app is ready to be deployed!

> _`yarn prod` and `npm run prod` do the same, and also run the app after building it._

### `yarn lint` or `npm run lint`

Runs the linter and logs every error and warning to the console.

> _`yarn lint:fix` and `npm run lint:fix` fix every autofixable error/warning._

### `yarn prettier` or `npm run prettier`

Runs Prettier and logs every error and warning to the console.

> _`yarn prettier:fix` and `npm run prettier:fix` fix every autofixable error/warning._

### `yarn check` or `npm run check`

Runs both the linter and Prettier and logs every error and warning to the console.

> _`yarn check:fix` and `npm run check:fix` fix every autofixable error/warning._

## 🚀 Deploying

A normal Dockerfile for a Node.js app won't work for this bot, as the [whatsapp-web.js](https://wwebjs.dev) library uses Puppeteer, and needs Chromium to run.\
This project's [Dockerfile](./Dockerfile) handles every installation, and sets the whole environment needed for the bot to run and be authenticated.

If the Docker image is built in a directory that has a `.wwebjs_auth` folder, it will use that file to authenticate and the container will start the bot without further authentication. If not, a QR code will be logged to the console and the user will have to scan it to authenticate.

## 🐳 Docker

You can use [Docker](https://www.docker.com) to run your app. This project has a multi-stage build process so your final image doesn't have any TypeScript files nor dev dependencies, resulting in a smaller image size.

To [build your image](https://docs.docker.com/engine/reference/commandline/build) run: `docker build -t <image-name> .`

To [run your image](https://docs.docker.com/engine/reference/run) run: `docker run -p 80:80 <image-name>`

> If you haven't used Docker before, you can get started with it [here](https://www.docker.com/get-started).

## 👤 Author

<a href="https://github.com/totigm" target="_blank">
  <img alt="GitHub: totigm" src="https://img.shields.io/github/followers/totigm?label=Follow @totigm&style=social">
</a>
<br>
<a href="https://twitter.com/totigm8" target="_blank">
  <img alt="Twitter: totigm8" src="https://img.shields.io/twitter/follow/totigm8?style=social" />
</a>
<br>
<a href="https://linkedin.com/in/totigm" target="_blank">
  <img alt="LinkedIn: totigm" src="https://img.shields.io/badge/LinkedIn-@totigm-green?style=social&logo=linkedin" />
</a>
<br>
<a href="https://www.npmjs.com/~totigm" target="_blank">
  <img alt="NPM: totigm" src="https://img.shields.io/badge/NPM-@totigm-green?style=social&logo=npm" />
</a>

## 🤝 Contributing

Contributions are more than welcome!

We think that you might have great ideas to make this project even better. If you do, please create a pull request and/or issue following the [contribution guidelines](./docs/CONTRIBUTING.md).

## ⭐️ Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Toti Muñoz](https://github.com/totigm).<br />
This project is [MIT](https://github.com/totigm/ts-package-template/blob/master/LICENSE) licensed.

---

This project was made with ❤ and TypeScript
