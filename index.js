const fs = require('fs')
const path = require('path')
const markdownpdf = require('markdown-pdf')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-abbr'))

const stylePath = path.join(__dirname, 'node_modules', 'style.css', 'style.css')
const mdPath = path.join(__dirname, 'build', 'index.md')
const cssPath = path.join(__dirname, 'build', 'index.css')
const htmlWritePath = path.join(__dirname, 'build', 'index.html')
const pdfWritePath = path.join(__dirname, 'build', 'index.pdf')
const cssWritePath = path.join(__dirname, 'build', 'index.css')

const encoding = { encoding: 'utf-8' }
const contract = fs.readFileSync(mdPath, encoding)
const style = fs.readFileSync(stylePath, encoding)

const css = `${style}
@page { margin: 5em 5.25em }
@media print {
  html { font-size: 13px; }
  main {
    margin: 0 auto;
    max-width: 50em;
  }
}
`

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Web Development Contract</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <main>${md.render(contract)}</main>
</body>
</html>
`

// write css
fs.writeFileSync(cssWritePath, css, encoding)

// write html
fs.writeFileSync(htmlWritePath, html, encoding)

// write pdf
fs.createReadStream(mdPath)
  .pipe(markdownpdf({ cssPath: cssPath }))
  .pipe(fs.createWriteStream(pdfWritePath))
