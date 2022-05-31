import Head from "next/head";
import Product from "../components/Product";
import { SiteClient } from "datocms-client";
import { useEffect, useState } from "react";
import { ProductType, UploadType } from "../types";
import styles from "../styles/index.module.css";
import Script from 'next/script'
import Link from 'next/link'

const client = new SiteClient(
  process.env.NEXT_PUBLIC_DATOCMS_READONLY_API_KEY ||
    "54c731b10e58adae303dc14b37ffff"
);

export default function Home() {
  const [products, setProducts] = useState<ProductType[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await client.items.all({
        filter: { type: "product" },
      });

      const withImages = await Promise.all(
        allProducts.map(async (p: ProductType) => {
          const upload: UploadType = await client.upload.find(p.image.uploadId);

          p.image = { ...p.image, ...upload };
          return p;
        })
      );

      setProducts(withImages);
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>My Next.js E-commerce</title>
        <Link rel="icon" href="/favicon.ico" />
        <Link rel="preconnect" href="https://cdn.snipcart.com" />
        <Link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.css"
        />
      </Head>

      <main className={styles.main}>
        <h1>E-Commerce in Next.js and SnipCart!</h1>

        <div className={styles.grid}>
          {products &&
            products.map((product, i) => <Product product={product} key={i} />)}
        </div>
      </main>
      <Script src="https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.js"></Script>
      <div
        hidden
        id="snipcart"
        data-config-modal-style="side"
        data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
      ></div>
    </div>
  );
}
