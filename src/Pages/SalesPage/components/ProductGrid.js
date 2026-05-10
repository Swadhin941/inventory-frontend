import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";
import { Button } from "antd";
import { getAllProductsApi, loadMoreProductsApi } from "../../../Services/slices/product.slice";
import { useState } from "react";
import Spinner from "../../../Components/Spinner/Spinner";

const ProductGrid = ({
    cart = [],
    search = "",
    setSearch,
    addToCart,
}) => {
    const { products, totalProducts, loadMoreProductLoading }= useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const normalizedSearch = search.trim().toLowerCase();
    const getProductId = (product) => product._id || product.id;
    const filteredProducts = products.filter((item) =>
        [item.name, item.model, item.brand]
            .filter(Boolean)
            .some((value) =>
                String(value).toLowerCase().includes(normalizedSearch)
            )
    );

    const handleLoadMore = () => {
        setPage((prev) => prev + 1);
        dispatch(loadMoreProductsApi({ page: page, limit }));
    };

    return (
        <div>
            {/* SEARCH BAR */}
            <input
                className="search-input"
                placeholder="Search products by name, model, or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* PRODUCT GRID */}
            <div className="row">
                {filteredProducts.map((item) => {
                    const productId = getProductId(item);
                    const cartItem = cart.find(
                        (product) => getProductId(product) === productId
                    );

                    return (
                        <div
                            className="col-12 col-sm-6 col-xl-4 mb-3"
                            key={productId}
                        >
                            <ProductCard
                                item={item}
                                addToCart={addToCart}
                                cartQty={cartItem?.qty || 0}
                            />
                        </div>
                    );
                })}
                {products.length < totalProducts && (
                    <div className="col-12">
                        <div className="text-center">
                            <Button type="primary" onClick={handleLoadMore}>Load More {loadMoreProductLoading && <Spinner /> }</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
