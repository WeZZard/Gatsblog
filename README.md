A static blog system implemented with Gatsby.js.

## Usage

1. `git clone https://github.com/WeZZard/Gatsblog.git`

2. Remove my posts in `content/_posts/`

3. Edit you `content/profile`

4. Edit site metadata in `config/config.yml`

5. Edit PWA manifest( contents under `resolve: gatsby-plugin-manifest` ) in `gatsby-config.js`.

## Deloy

### Netlify

You can easily deploy to Netlify by creating a site with a git repo on GitHub.
The only thing you have to do is push your site on a GitHub repo and then create
a site on Netlify.

### GitHub Page

Notes: The following process shall be done with an automated program. Remvoing
`public` in `.gitignore` makes `git` to crazily add tons of files to record,
which may be a very long progress. The best practice may be creating a new repo
with `.gitignore` which doesn't contain `public` and then automatically clone,
build and push.

1. Install gatsby-cli: `npm install -g gatsby-cli`

2. Build your site with `gatsby build`

3. Remove `public` in `.gitignore`

4. Push to Github.

## License

MIT
