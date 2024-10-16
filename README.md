# garden-frontend

Web UI for thegardens.ai

# Branches and deployment

- `staging` is the main branch in this repo. It is the one that you should make PRs against. Merges to `staging` trigger a deployment to our staging site, https://garden-ai.github.io/garden-frontend-staging/
  - To get to the home page, include /#/home at the end of the url
- `prod` is a branch used to deploy vetted code from the `staging` branch to production, https://thegardens.ai/.

The `staging` branch is the source of truth for development in this repo. `prod` only exists for deployment purposes. If you make a change to `prod` that isn't on `staging`, it will soon get blown away. If there are merge conflicts between `prod` and `staging`, we will force push the contents of `staging` to `prod` with `git push origin --force staging:prod`.

# Workflow

1. When you pick up a feature or bug, make a branch off of staging. Like `will/45-new-page`.
2. Make the needed changes on your branch and test them locally.
3. Open a PR from your branch to `staging`.
4. If the tests pass and another developer approves your change, merge in to staging. After merging, see if everything is looking good on [the staging site](https://garden-ai.github.io/garden-frontend-staging/).
5. If so, open a "deployment" PR from staging into prod and merge it

# Getting started locally

After cloning, run `npm install` to pull in dependencies and then `npm start` to test changes locally with hot reloading.

# Using msw mocks

The `src/mocks` folder has configuration for `msw`, a library that mocks external API responses.
This is useful to set up static garden/entrypoint responses to develop against no matter the state of the backend.

To use this when developing locally, uncomment `VITE_APP_SHOULD_MOCK="true"` in `.env.development`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
