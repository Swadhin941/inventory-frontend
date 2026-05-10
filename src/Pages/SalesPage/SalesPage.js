import React, { useEffect, useState } from "react";
import CustomerForm from "./components/CustomerForm";
import ProductGrid from "./components/ProductGrid";
import OrderSummary from "./components/OrderSummary";
import "./SalesPage.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsApi } from "../../Services/slices/product.slice";

const SalesPage = () => {
    const dispatch = useDispatch();
    const [page] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const { products } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getAllProductsApi({ page, limit }));
    }, [dispatch, page, limit]);

    const getProductId = (product) => product._id || product.id;

    const addToCart = (product) => {
        const productId = getProductId(product);

        setCart((currentCart) => {
            const existing = currentCart.find(
                (item) => getProductId(item) === productId
            );

            if (existing) {
                return currentCart.map((item) =>
                    getProductId(item) === productId
                        ? {
                              ...item,
                              qty:
                                  item.stock && item.qty >= item.stock
                                      ? item.qty
                                      : item.qty + 1,
                          }
                        : item
                );
            }

            return [...currentCart, { ...product, qty: 1 }];
        });
    };

    const increaseQty = (id) => {
        setCart((currentCart) =>
            currentCart.map((item) =>
                getProductId(item) === id
                    ? {
                          ...item,
                          qty:
                              item.stock && item.qty >= item.stock
                                  ? item.qty
                                  : item.qty + 1,
                      }
                    : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    getProductId(item) === id
                        ? { ...item, qty: item.qty - 1 }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const removeItem = (id) => {
        setCart((currentCart) =>
            currentCart.filter((item) => getProductId(item) !== id)
        );
    };

    return (
        <div className="container-fluid sales-page">
            <div className="row sales-layout">

                {/* LEFT SIDE */}
                <div className="col-12 col-lg-8">
                    <div className="mb-3">
                        <CustomerForm />
                    </div>

                    <ProductGrid
                        products={products}
                        cart={cart}
                        search={search}
                        setSearch={setSearch}
                        addToCart={addToCart}
                    />
                </div>

                {/* RIGHT SIDE */}
                <div className="col-12 col-lg-4 sales-summary-column">
                    <OrderSummary
                        cart={cart}
                        increaseQty={increaseQty}
                        decreaseQty={decreaseQty}
                        removeItem={removeItem}
                    />
                </div>

            </div>
        </div>
    );
};

export default SalesPage;
