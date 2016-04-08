# Markdown Live View

This is a small application that I have created to help me write blog posts in Vim in Markdown.

Markdown editors exist, and while they are not Vim, they offer something native Vim doesn't: the ability to see your changes reflected in realtime in rendered form. This application combined with a bit of Vimscript gives you the same thing.

## Structure

This application consists of a Node.js server and a single-page application. The server listens on the following ports:

- 80: Serves the single page application (consisting entirely of static files).
- 1337: Listens for requests to render a particular markdown file in the browser, getting the filename from a custom X-Filename header.
- 3000: Allows WebSocket connections via Socket.io, and sends them Markdown content every time a request comes through on port 1337.

The client thus connects to the server on port 3000 using Socket.io, registers a listener for markdown change events, and, every time new markdown comes in, uses [remarkable](https://github.com/jonschlinkert/remarkable), [MathJax](https://www.mathjax.org/), and [highlight.js](https://highlightjs.org/) to render the Markdown in the page.

## Running This

Install and run this via:

```bash
cd vim-markdown-author
npm install
npm run compile
npm start
```

You can then query it with `curl`:
```bash
echo '# Testing...' > test.md
curl localhost:1337 -H "X-Filename: $(pwd)/test.md"
```
If you have `localhost` open in a browser, you should see the content change.

## Using from `vim`

I use the following autocommands to connect this to Neovim:
```
augroup markdownsave
  autocmd!
  au InsertCharPre,InsertLeave,CursorHold,CursorHoldI *.md w 
  au InsertCharPre,BufWritePost,InsertLeave,CursorHoldI,CursorHold *.md silent !curl --silent localhost:1337 -H "X-Filename: %"
  set updatetime=300
augroup END
```

This provides a fairly nice and interactive experience.

## Demo

Live Demo:

![Demo Video](https://github.com/gibiansky/vim-markdown-author/blob/master/demo.gif)
