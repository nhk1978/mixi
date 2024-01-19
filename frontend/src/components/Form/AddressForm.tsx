import { useForm } from 'react-hook-form';

import { AddressType } from '../../types/Address';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { updateConfirmOrder } from '../../redux/reducers/orderReducer';

const AddressForm = ({ cartId }: { cartId?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressType>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);

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
        />
        {errors.address && (
          <span className='form--error'>
            This field is required to put a shipping address!
          </span>
        )}
      </div>

      <button type='submit' className='form__button'>
        Pay for your order
      </button>
    </form>
  );
};

export default AddressForm;
