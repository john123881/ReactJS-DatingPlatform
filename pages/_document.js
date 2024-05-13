import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" data-theme="black">
      <Head />
      <body className="bg-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
