import React from "react";
import "./Menu.css";
import ProductCard from "../ProductCard/ProductCard";

const Menu = ({ props }) => {
  return (
    <div className="menu">
      <ProductCard key={props} product={props} />
      <ProductCard />
      <ProductCard />
    </div>
  );
};

export default Menu;
