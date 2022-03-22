![Development](https://github.com/ravorona/sage/actions/workflows/develop.yml/badge.svg) ![Release](https://github.com/ravorona/sage/actions/workflows/publish.yml/badge.svg)

# Wordpress starter theme

* Based on [Sage](https://roots.io/sage/) version [9.0.10](https://github.com/roots/sage/releases/tag/9.0.9)
* Using [Vite](https://vitejs.dev)


## Requirements

* [Vite](https://vitejs.dev) >= 2.6.9
* [Node.js](http://nodejs.org/) >= 16.0.0
* [Yarn](https://yarnpkg.com/en/docs/install)

## Theme installation

Install Sage using Composer from your WordPress themes directory (replace `your-theme-name` below with the name of your theme):

```shell
# @ app/themes/ or wp-content/themes/
$ composer create-project ravorona/sage your-theme-name
```

To install the latest development version of Sage, add `dev-master` to the end of the command:

```shell
$ composer create-project ravorona/sage your-theme-name dev-master
```

## Theme structure

```shell
themes/your-theme-name/   # → Root of your Sage based theme
├── app/                  # → Theme PHP
│   ├── Controllers/      # → Controller files
│   ├── admin.php         # → Theme customizer setup
│   ├── filters.php       # → Theme filters
│   ├── helpers.php       # → Helper functions
│   └── setup.php         # → Theme setup
├── composer.json         # → Autoloading for `app/` files
├── composer.lock         # → Composer lock file (never edit)
├── dist/                 # → Built theme assets (never edit)
├── node_modules/         # → Node.js packages (never edit)
├── public/               # → Static assets folder. Every assets placed in this folder will be copied through webpack (never edit)
├── package.json          # → Node.js dependencies and scripts
├── resources/            # → Theme assets and templates
│   ├── assets/           # → Front-end assets
│   │   ├── config.json   # → Settings for compiled assets
│   │   ├── config.json   # → Settings for pwa
│   │   ├── fonts/        # → Theme fonts
│   │   ├── images/       # → Theme images
│   │   ├── scripts/      # → Theme JS
│   │   └── styles/       # → Theme stylesheets
│   ├── functions.php     # → Composer autoloader, theme includes
│   ├── index.php         # → Never manually edit
│   ├── screenshot.png    # → Theme screenshot for WP admin
│   ├── style.css         # → Theme meta information
│   └── views/            # → Theme templates
│       ├── layouts/      # → Base templates
│       └── partials/     # → Partial templates
└── vendor/               # → Composer packages (never edit)
```

## Theme development

* Run `yarn` from the theme directory to install dependencies
* Update `vite.config.ts` for fine tuning

### Build commands

* `yarn dev` — Start dev server
* `yarn build` — Compile assets
* `yarn lint` — Lint stylesheets & javascripts
* `yarn lint:css` — Lint stylesheets
* `yarn lint:js` — Lint javascripts

## Documentation

* [Sage documentation](https://roots.io/sage/docs/)
* [Controller documentation](https://github.com/soberwp/controller#usage)
* [Vite](https://vitejs.dev/guide/)
