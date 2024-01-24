import { useForm } from 'react-hook-form';

import { AddressType } from '../../types/Address';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { updateConfirmOrder, updatePaymentOrder } from '../../redux/reducers/orderReducer';
import { OrderStatus } from '../../types/Order';

const AddressForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressType>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);
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
          readOnly = {currentStatus !== OrderStatus.Pending}
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
          readOnly = {currentStatus !== OrderStatus.Pending}
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
          readOnly = {currentStatus !== OrderStatus.Pending}
        />
        {errors.phone && (
          <span className='form--error'>
            This field is required to put a valid phone number!
          </span>
        )}
      </div>
      <div className='form__group'>
      <input
          type='text'
          placeholder='Enter your address'
          defaultValue={currentUser?.address}
          {...register('address', { required: true })} 
          readOnly = {currentStatus !== OrderStatus.Pending}
        />
        
        {errors.address && (
          <span className='form--error'>
            This field is required to put a shipping address!
          </span>
        )}
      </div>

      {currentStatus !== null && currentStatus === OrderStatus.Pending && <button type='submit' className='form__button'>
        Confirm for your order
      </button>}

      {(currentStatus === OrderStatus.AwaitingPayment) && (<button type='submit' className='form__button'>
        Pay for your order
      </button>)}
      {(currentStatus === OrderStatus.AwaitingFulfillment) && (<span className='form__group'>
            Thank you for your ordering. Please wait for fulfillment.
          </span>)}
    </form>
  );
};

export default AddressForm;
