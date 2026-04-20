import { useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products = [], cart = [], addToCart }) => {
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* SEARCH BAR */}
            <input
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* PRODUCT GRID */}
            <div className="row">
                {filteredProducts.map((item) => {
                    const isSelected = cart.find(p => p.id === item.id);

                    return (
                        <div className="col-6 col-lg-4 mb-3" key={item.id}>
                            <ProductCard
                                item={item}
                                addToCart={addToCart}
                                isSelected={isSelected}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductGrid;