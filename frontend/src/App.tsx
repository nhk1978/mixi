import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAppDispatch from './hooks/useAppDispatch';
import useAppSelector from './hooks/useAppSelector';
import { fetchAllProducts } from './redux/reducers/productsReducer';
import { login } from './redux/reducers/usersReducer';
import { fetchAllCategories } from './redux/reducers/categoriesReducer';
import Header from './components/Header';
import Footer from './components/Footer';
import Routes from './routes/Routers';
import './assets/styles/styles.scss';
import Cart from './components/Cart/Cart';


const App = () => {
  const isSideCartVisible = useAppSelector(
    (state) => state.cart.isSideCartVisible
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
    // dispatch(fetchAllReviews());

    const isAuthenticated = localStorage.getItem('token');
    const storedCredentials =
      localStorage.getItem('userCredential') !== null &&
      JSON.parse(localStorage.getItem('userCredential') ?? '');

    const email = storedCredentials.email;
    const password = storedCredentials.password;

    if (isAuthenticated && storedCredentials !== '') {
      dispatch(login({ email, password }));
    }
  }, [dispatch]);

  return (
    <div className='layout'>
      <Header />
      {isSideCartVisible && <Cart />}
      <div>
        <Routes />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
