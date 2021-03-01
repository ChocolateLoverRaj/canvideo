const glob = require('glob')
const path = require('path')
const postHtml = require('posthtml')
const fs = require('fs')

const transformer = postHtml([
  // Add a content security policy meta tag
  tree => {
    tree.match({ tag: 'head' }, node => ({
      ...node,
      content: [
        ...node.content,
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: 'script-src \'self\''
          }
        }
      ]
    }))
  },
  // Change absolute paths to relative paths
  tree => {
    const srcRegex = /^\//
    tree.match({ attrs: { href: srcRegex } }, node => {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          href: `.${node.attrs.href}`
        }
      }
    })
    tree.match({ attrs: { src: srcRegex } }, node => {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: `.${node.attrs.src}`
        }
      }
    })
  }
])

glob.sync(path.join(__dirname, '../out/*.html')).forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  const transformedContent = transformer
    .process(content, { sync: true })
    .html
  fs.writeFileSync(file, transformedContent)
})
