# 🤖 WhatsApp stickers bot

This is a WhatsApp bot to convert images and videos to stickers.

[Live demo](http://wa.me/5492644867397)

## 💬 Commands

The bot supports two primary commands in addition to the `!help` command:

- `!sticker`: Converts an image or video into a sticker. For images, it generates a standard sticker, while for videos, it creates an animated sticker (gif-like).
- `!image`: Processes an image and returns it with applied edits. By default, it returns the original image unless combined with one or more of the following arguments.

### ✨ List of Arguments

Both `!sticker` and `!image` commands can be enhanced with these optional arguments:

> [!WARNING]
> For the `!sticker` command, arguments are applicable only to images, not videos.

- **`resize=width/height`**: Resizes the sticker/image to the specified width and height. Use `x`, `.`, or `/` as separators.
- **`negate`**: Inverts the colors of the sticker/image. No additional value required.
- **`grayscale`/`greyscale`**: Converts the sticker/image to black and white. No additional value required.
- **`blur=level`**: Applies a blur effect to the sticker/image. Accepts values from 0 (no blur) to 100 (fully blurred).
- **`lightness=level`**: Adjusts the lightness of the sticker/image. Accepts numeric values. Lightness is additive, impacting the overall brightness without altering the relative luminance of colors.
- **`brightness=level`**: Modifies the brightness of the sticker/image. Accepts numeric values. Brightness operates multiplicatively, affecting the luminance of each color in the image.
- **`saturation=level`**: Alters the saturation level. Accepts a numeric value, enhancing or reducing the color intensity.
- **`hue=level`**: Changes the hue. Accepts values from 0 to 360 degrees.
- **`removeBg`**: Removes the background. Requires a [remove.bg API key](https://www.remove.bg/es/dashboard#api-key) in the [.env file](./.env.example). No additional value required.
- **`bgColor=color`**: Replaces the background with a specified color. Accepts color names (e.g., `red`) or hex codes (e.g., `#ff0000`).
- **`bgImageUrl=URL`**: Replaces the background with an image from the provided URL.
- **`text='Your text'`**: Adds custom text to the image. Expects a string.
- **`textSize=size`**: Sets the size of the text. Effective only if text is added. Default is `128`.
- **`textColor=color`**: Sets the text color. Effective only if text is added. Accepts color names or hex codes, defaulting to `black`.
- **`textPosition=position`**: Adjusts text position. Effective only if text is added. Options include `top`, `topRight`, `right`, `bottomRight`, `bottom`, `bottomLeft`, `left`, `topLeft`, and `center`. Default is `top`.

> [!TIP]
> Multiple arguments can be combined and used at the same time for more customized effects.


Here is an example of the base command:\
![Base command](https://github.com/totigm/whatsapp-stickers-bot/assets/64804554/446259b2-2cc6-459d-a546-442316df23ac)
> [!NOTE]
> For more detailed examples, please see the [examples](./docs/examples.md) documentation.

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
