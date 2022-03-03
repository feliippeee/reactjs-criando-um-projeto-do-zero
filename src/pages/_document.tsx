import Document, {Html, Head, Main, NextScript} from 'next/document';


export default class MyDocument extends Document {
   render() {
     //TODO
     return (
       <Html lang="en">
          <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            <link rel="shortcut icon" href="/Vector.png" type="image/png" />
          </Head>
       <body>
         <Main />
         <NextScript />
         <script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=criando-aplicacao-do-zero"></script>
       </body>
       </Html>
      
     )
  }
}
