import { useDispatch, useSelector } from "react-redux";
import "./ProductStats.css";
import { useEffect } from "react";
import { getProductStatisticsApi } from "../../../Services/slices/product.slice";
import { Skeleton } from "antd";

const ProductStats = () => {
    const { statistics, statsLoader } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProductStatisticsApi());
    }, [dispatch]);
    const stats = [
        {
            title: "Total Products",
            value: statistics?.totalProducts || 0,
            type: "default",
        },
        {
            title: "In Stock",
            value: statistics?.totalInStockProducts || 0,
            type: "success",
        },
        {
            title: "Low Stock",
            value: statistics?.totalLowStockProducts || 0,
            type: "warning",
        },
        {
            title: "Out of Stock",
            value: statistics?.totalOutOfStockProducts || 0,
            type: "danger",
        },
    ];

    return (
        <div className="stats-container">
            {statsLoader ? (
                <Skeleton active />
            ) : (
                stats.map((item, i) => (
                    <div className="stats-card" key={i}>
                        <p className="stats-title">{item.title}</p>
                        <h2 className={`stats-value ${item.type}`}>
                            {item.value}
                        </h2>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductStats;
