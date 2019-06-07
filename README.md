#### panorama.front

##### Project setup
```
npm install
copy example.globals.ts to globals.ts
specify urls for backend
```

### Compiles and hot-reloads for development
```
npm run serve
tsc -w (to run typescript)
```

### Compiles for production and pushes to remote origin
```
npm run build
git add dist && git commit -m "Commit name"
git subtree push --prefix dist origin production
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```
