# motika

Motika project aims to improve the UX and ease the user when it comes to creating multisig accounts, generating and signing offline multisig transactions and inspecting the result of such after they get broadcasted, mined and finalized in the Secret Network.

The project is dependant on `secretcli` which is the CLI tool for interacting with secret network.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development

Use one of the following commands to either spin up the hot-reloading dev environment to be used in a local browser or in an electron wrapped UI.
```
npm run serve
npm run electron:serve
```

### Compiles and minifies for production
```
npm run build
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contributing

We use the [gitflow](https://danielkummer.github.io/git-flow-cheatsheet/) workflow [this is also helpful](https://gist.github.com/JamesMGreene/cdd0ac49f90c987e45ac).
* Development of features happens in branches made from **develop** called feature/<the-feature> like feature/add-close-button.
* When development is finished a pull request to **develop** is created. At least one person has to review the PR and when everything is fine the PR gets merged.
* To make a new release create a release branch called release/X.X.X, also bump the version number in package.json in this branch.
* Create a PR to `main` which then also has to be accepted.
* Create a tag for this version and push the tag.
* Also merge back the changes (like the version bump) into `develop`.
  
### Rules
- Use `rebase` instead of `merge` to update your codebase, except when a PR gets included in a branch.
- Use meaningfull descriptions and titles in commit messages.
- Explain what you did in your PRs, add images whenever possible for showing the status before/after the change visually. 

