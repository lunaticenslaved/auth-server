### Server pre-install

##### Init node project

- `npm init`
- `git init`
- add gitignore

##### Add typescript

- create tsconfig with configs
- run `npm i -D @types/node ts-node tsc-alias typescript nodemon tsconfig-paths`
- add scripts `build`, `start`, `dev`

##### Add linting and formatting

- `npm i -D eslint prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/eslint-plugin`
- add scripts `lint`, `format`
- add .vscode folder

##### Add prisma

- `npm i prisma`
- add scripts `db:generate`, `db:migrate`

##### Add deploy

- add script `deploy`

##### Add jest

- `npm i -D jest @types/jest ts-jest`
- run `npx jest --init`
- add `"jest"` to `"types"` in `tsconfig`
