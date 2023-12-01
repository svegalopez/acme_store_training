import styles from "./Shop.module.css";
import Product from "../Product/Product";
import Page from "../Page/Page";
import Spinner from "../Spinner/Spinner";
import { useQuery } from "@tanstack/react-query";
import Chatbot from "../Chatbot/Chatbot";

export default function Shop() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      const response = await fetch(`${process.env.HOST}/api/products`);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) return <Spinner />;

  return (
    <Page centered>
      {error && <p>{error.message}</p>}
      {products && (
        <div className={styles.productList}>
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      )}
      <Chatbot />
    </Page>
  );
}
