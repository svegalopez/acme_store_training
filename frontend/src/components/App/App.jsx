import React from "react";
import Title from "../Title/Title";
import { AuthContextProvider } from "../../contexts/AuthContext";

function App() {
  const [products, setProducts] = React.useState([]);

  const onClick = async () => {
    const response = await fetch("http://localhost:3088/api/products");
    const data = await response.json();
    setProducts(data);
  };

  return (
    <AuthContextProvider>
      <Title text="ACME Pet Supplies" />
      <button onClick={onClick}>Click me</button>
      <ul>
        {products.map((el) => (
          <li key={el.id}>{el.name}</li>
        ))}
      </ul>
    </AuthContextProvider>
  );
}

export default App;
