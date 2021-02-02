import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Reddit</title>
          <link rel="icon" href="/redditlogo.svg" type="image/svg+xml" />
          <meta property="og:site_name" content="reddit" />
          <meta property="twitter:site" content="@reddit" />
          <meta property="og:type" content="website" />
          {/* <meta
            property="og:image"
            content={`${process.env.process.NEXT_PUBLIC_CLIENT_BASE_URL.toString()}/redditlogo.svg`}
          />
          <meta
            property="twitter:image"
            content={`${process.env.process.NEXT_PUBLIC_CLIENT_BASE_URL.toString()}/redditlogo.svg`}
          /> */}
          <meta property="twitter:card" content="summary" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
            integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
            crossOrigin="anonymous"
          />
        </Head>
        <body className="bg-gray-400 font-body dark:bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
