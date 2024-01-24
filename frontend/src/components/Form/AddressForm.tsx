import { useForm } from 'react-hook-form';

import { AddressType } from '../../types/Address';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
<<<<<<< HEAD
import { updateConfirmOrder } from '../../redux/reducers/orderReducer';

const AddressForm = ({ cartId }: { cartId?: string }) => {
=======
import { updateConfirmOrder, updatePaymentOrder } from '../../redux/reducers/orderReducer';
import { OrderStatus } from '../../types/Order';

const AddressForm = () => {
>>>>>>> 16fe228 (re-strcuture)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressType>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);
<<<<<<< HEAD

  const onSubmit = (data: AddressType) => {
    // console.log(data, cartId);
    dispatch(
      updateConfirmOrder({
        update: {
          recipient: data.recipient,
          email: data.email,
          phoneNumber: data.phone,
          address: data.address,
        },
      })
    );
=======
  const currentOrder = useAppSelector((state) => state.orders.currentOrder);
  const currentStatus = useAppSelector((state) => state.orders.currentStatus);


  const onSubmit = (data: AddressType) => {
    if(currentStatus == OrderStatus.Pending)
      dispatch(updateConfirmOrder({
          id: currentOrder?.id,
          update: {
            recipient: data.recipient,
            email: data.email,
            phoneNumber: data.phone,
            address: data.address,
          },
        })
      );
    else dispatch(updatePaymentOrder({
      id: currentOrder?.id,
      update: {
        recipient: data.recipient,
        email: data.email,
        phoneNumber: data.phone,
        address: data.address,
      },
    })
  ); 
>>>>>>> 16fe228 (re-strcuture)
  };

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <div className='form__group'>
        <input
          type='text'
          placeholder='Enter your name'
          defaultValue={
            currentUser && `${currentUser?.firstName} ${currentUser?.lastName}`
          }
          {...register('recipient', { required: true })}
<<<<<<< HEAD
=======
          readOnly = {currentStatus !== OrderStatus.Pending}
>>>>>>> 16fe228 (re-strcuture)
        />
        {errors.recipient && (
          <span className='form--error'>This field is required!</span>
        )}
      </div>
      <div className='form__group'>
        <input
          type='email'
          placeholder='Enter your email'
          defaultValue={currentUser?.email}
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
<<<<<<< HEAD
=======
          readOnly = {currentStatus !== OrderStatus.Pending}
>>>>>>> 16fe228 (re-strcuture)
        />
        {errors.email && (
          <span className='form--error'>
            This field is required to put a valid email!
          </span>
        )}
      </div>
      <div className='form__group'>
        <input
          maxLength={15}
          type='tel'
          placeholder='Enter your phone'
          defaultValue={currentUser?.phoneNumber}
          {...register('phone', { required: true, maxLength: 15 })}
<<<<<<< HEAD
=======
          readOnly = {currentStatus !== OrderStatus.Pending}
>>>>>>> 16fe228 (re-strcuture)
        />
        {errors.phone && (
          <span className='form--error'>
            This field is required to put a valid phone number!
          </span>
        )}
      </div>
      <div className='form__group'>
<<<<<<< HEAD
        <input
          type='text'
          placeholder='Enter your address'
          defaultValue={currentUser?.address}
          {...register('address', { required: true })}
        />
=======
      <input
          type='text'
          placeholder='Enter your address'
          defaultValue={currentUser?.address}
          {...register('address', { required: true })} 
          readOnly = {currentStatus !== OrderStatus.Pending}
        />
        
>>>>>>> 16fe228 (re-strcuture)
        {errors.address && (
          <span className='form--error'>
            This field is required to put a shipping address!
          </span>
        )}
      </div>

<<<<<<< HEAD
      <button type='submit' className='form__button'>
        Pay for your order
      </button>
=======
      {currentStatus !== null && currentStatus === OrderStatus.Pending && <button type='submit' className='form__button'>
        Confirm for your order
      </button>}

      {(currentStatus === OrderStatus.AwaitingPayment) && (<button type='submit' className='form__button'>
        Pay for your order
      </button>)}
      {(currentStatus === OrderStatus.AwaitingFulfillment) && (<span className='form__group'>
            Thank you for your ordering. Please wait for fulfillment.
          </span>)}
>>>>>>> 16fe228 (re-strcuture)
    </form>
  );
};

export default AddressForm;
