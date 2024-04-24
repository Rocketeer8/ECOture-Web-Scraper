import React from "react";

const ProductCard = (props) => {
  return (
    <div className="product-card">
      <img src={props.image} alt="clothing item" />
      <h2>{props.name}</h2>
      <div className="product-details">
        <p className="product-company">Old Navy</p>
        {console.log(props.materials.materials)}
        <p className="product-material">
          Product Materials: <br />
          {JSON.stringify(props.materials.materialList)}
        </p>
        {/* <p className="product-company">Product Materials:</p>
        {Array.from(props.materials.materials.entries()).map(([key, value]) => (
        <li key={key}>
          {key}: {value}%
        </li>
      ))} */}
      <p className="score">Score: {props.materials.materialScore}</p>
      </div>
    </div>
  );
};

export default ProductCard;
