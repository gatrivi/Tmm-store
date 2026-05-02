import { useState } from "react";
import menu from "./menu.json";
import PizzaCard from "./components/PizzaCard";
import Cart from "./components/Cart";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [orderString, setOrderString] = useState("");

  const addToCart = (pizza) => {
    setCart((prev) => [...prev, pizza]);
    setOrderString("");
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = () => {
    if (cart.length === 0) return;
    const items = cart.map((item) => `${item.name} ($${item.price.toLocaleString()})`).join(", ");
    setOrderString(`Pedido: ${items}. Total: $${total.toLocaleString()}`);
  };

  return (
    <div className="app">
      <header>
        <h1>🍕 Pizzería Trufi</h1>
      </header>
      <main>
        <div className="menu">
          {menu.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} onAdd={() => addToCart(pizza)} />
          ))}
        </div>
        <Cart cart={cart} total={total} onOrder={handleOrder} orderString={orderString} />
      </main>
    </div>
  );
}

export default App;
