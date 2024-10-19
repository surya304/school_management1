exports.emailTemplate = (function( name, email ) {

    return `<!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Alert</title>
      </head>
      <body>
        <h3>Smartsites - New Signup Alert</h3>
        <p>Name - ${name}</p>
        <p>Email - ${email}</p>    
      </body>
    </html>
    `
        
    })
        