import { jsdom } from 'jsdom'

const document = jsdom(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Example</title>
    </head>
    <body>

    </body>
  </html>
  `)

global.document = document

global.window = document.defaultView
