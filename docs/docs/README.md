# Cerebral static site builder

### The why
Though it is great that we are using a static site builder, it is rather complex to use. It is also rather slow and it is generally difficult to contribute.

### Features

- Uses React components to create static markup
- `babel-node` allows for ES2015 and JSX
- `babel-watch` restarts server on changes... very fast
- `markdown-to-react-components` is used to convert markdown into React. This also contains the TOC of the file
- Css and Scripts are loaded through config
- Can add any new content as we wish, where `docs` is the hook for using markdown
- It has search

### Demo
Start the demo with `npm start`. It shows off menu, TOC, rendering markdown and search. To build run `npm run build`. A static version is available in `dist` folder. Run `python` or whatever to test.

### Summary
Contributing to these docs is as simple as adding components, markdown, css and scripts. It is all wired in the `config.json` file. Easy to understand.
