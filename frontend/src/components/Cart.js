import React from "react";

import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

const Cart = () => {
  return (
    <div className="mt-4 h-full shadow-2xl">
      <h1 className="w-full text-center text-3xl font-semibold text-black pb-2 border-b-2">
        Shopping Cart
      </h1>
      <ul className="grid items-start justify-start p-4 gap-4">
        <li>
          <CartTile
            title="Comfortable Stretchable Casual Denim Jeans Light Blue Size 34 Slim Fit Mid Rise Flat Front Full Length Modern & Fashionable for Casual Wear Comfort and Flexibility"
            discount="78%"
            price="639"
            mrp="3000"
            isAvilable
            size="34"
            color="Blue"
            quantity="1"
          />
        </li>
        <li>
          <CartTile
            title="Comfortable Stretchable Casual Denim Jeans Light Blue Size 34 Slim Fit Mid Rise Flat Front Full Length Modern & Fashionable for Casual Wear Comfort and Flexibility"
            discount="78%"
            price="639"
            mrp="3000"
            isAvilable
            size="34"
            color="Blue"
            quantity="1"
          />
        </li>
        <li>
          <CartTile
            title="Comfortable Stretchable Casual Denim Jeans Light Blue Size 34 Slim Fit Mid Rise Flat Front Full Length Modern & Fashionable for Casual Wear Comfort and Flexibility"
            discount="78%"
            price="639"
            mrp="3000"
            isAvilable
            size="34"
            color="Blue"
            quantity="1"
          />
        </li>
      </ul>
    </div>
  );
};

function CartTile({
  title,
  discount,
  price,
  mrp,
  isAvilable,
  size,
  color,
  quantity,
}) {
  return (
    <div className="card bg-base-100 shadow-xl max-w-xs md:w-full">
      <figure>
        <img
          src="https://m.media-amazon.com/images/I/71a3OycnGYL._AC_AA180_.jpg"
          alt="Movie"
          width={"160px"}
          className="mt-4"
        />
      </figure>
      <div className="card-body p-4 lg:p-6">
        <h2 className="card-title text-xs xl:text-sm line-clamp-3">{title}</h2>
        {discount && (
          <p className="bg-red-500 text-white p-1 w-fit text-xs">
            {discount} off
          </p>
        )}
        {price && (
          <div className="grid w-fit">
            <p className="text-sm">
              <CurrencyRupeeOutlinedIcon fontSize="10px" className="mb-[2px]" />{" "}
              {price}
            </p>
            {mrp && (
              <p className="text-sm">
                M.R.P:{" "}
                <CurrencyRupeeOutlinedIcon
                  fontSize="10px"
                  className="mb-[2px]"
                />
                <span className="line-through">{mrp}</span>
              </p>
            )}
          </div>
        )}
        {isAvilable && <p className="text-sm text-green-600 -mt-2">In Stock</p>}
        {size && (
          <p className="text-sm -mt-2">
            <span className="font-semibold">Size: </span>
            {size}
          </p>
        )}
        {color && (
          <p className="text-sm -mt-2">
            <span className="font-semibold">Color: </span>
            {color}
          </p>
        )}
        <select className="select select-bordered select-xs max-w-[80px]">
          {Array(10)
            .fill(1)
            .map((x, y) => x + y)
            .map((x) => {
              // eslint-disable-next-line eqeqeq
              if (quantity == x) return <option key={x}>{x}</option>;
              return <option key={x}>{x}</option>;
            })}
        </select>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div> */}
      </div>
    </div>
  );
}

export default Cart;
