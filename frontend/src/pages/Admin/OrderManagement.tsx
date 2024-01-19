import { useEffect } from 'react'
import useAppSelector from '../../hooks/useAppSelector'
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchAllOrders } from '../../redux/reducers/orderReducer';

const OrderManagement = () => {
    const orders = useAppSelector(state => state.orders.orders);
    const dispatch = useAppDispatch()
    console.log(orders);
    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])
    return (
        <div className="order-management">
            {orders.map(order => (
                <div key={order.id} className="order-management__item">
                    <div className="order-management__item__property">
                        <h4>User Id:</h4>
                        <p>{order.userId}</p>
                    </div>
                    <div>
                        <h4>Recipient:</h4>
                        <p>{order.recipient}</p>
                    </div>
                    <div>
                        <h4>Email:</h4>
                        <p>{order.email}</p>
                    </div>
                    <div>
                        <h4>Address:</h4>
                        <p>{order.address}</p>
                    </div>
                    <div>
                        <h4>Phone number:</h4>
                        <p>{order.phoneNumber}</p>
                    </div>
                    <div>
                        <h4>Order Status:</h4>
                        <p>{order.status}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OrderManagement