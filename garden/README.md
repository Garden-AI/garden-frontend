# garden-frontend

The frontend repo for thegardens.ai

## Repo Layout

The frontend is currently hosted using GitHub pages with automated deployment through GitHub Actions.

The `src` directory contains the bulk of the application:

- `api/`: API calls that are shared across the application.
- `app/`: The root of the application, routing, and a provider file that wraps the application with necessary providers.
- `components/`: Shared functional components used across the application. Can be further subdivided based on commonalities, if this folder gets too unwieldy.
- `features/`: The features folder contains all of the individual 'features' present in the Garden frontend. For example, the 'search' feature contains all of the relevant components, API calls, and hooks that the search page uses. Each feature contains the relevant subfolders for that feature: a `/components` folder, an `/api` folder, sometimes a `/utils`, `/hooks`, or `/types` folder, for utility functions, hooks, and types specific to that feature, and whatever else makes sense for that feature.
- `hooks/`: Shared hooks used across the application.
- `lib/`: Shared library setup typescript/javascript files.
- `types/`: Shared types across the application.
- `utils/`: Shared utility functions used across the application.

## Scripts

`npm run start`: Starts the application in dev mode for local development
`npm run start:local`: Can be used in conjunction with locally running backend to test local changes to backend repo. (Changes the API URL to localhost:5500)
`npm run build`: Builds the application for production, outputs build files to `/build` directory
`npm run build:staging`: Builds the application for staging, once again outputs build files to `/build` directory
`npm run preview`: Can be used in conjuction with the build scripts to see builds in action.
`npm run refresh-types`: Script to synchronize types with the backend staging deployment, written to the `/types/backend-schema.ts` file. Should be run manually anytime there are major changes to the backend staging deployment.
`npm run test`: Runs all tests for the frontend (currently just one).

## Branches and Deployment

`staging` is the default branch (make PRs against `staging`)

A merge to `staging` will automatically deploy to the staging URL.

A merge to `prod` will automatically deploy to the Garden production URL.
