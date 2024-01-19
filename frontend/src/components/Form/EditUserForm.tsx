import React, { useState } from 'react';

import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { UserUpdate } from '../../types/UserUpdate';
import { updateUser } from '../../redux/reducers/usersReducer';

const EditUserForm = ({
  setEditPageVisible,
}: {
  setEditPageVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phoneNumber || ''
  );
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  const dispatch = useAppDispatch();

  const editFormHandler = (e: any) => {
    e.preventDefault();
    if (currentUser) {
      const updatedUser: UserUpdate = {
        id: currentUser.id,
        update: {
          role: currentUser.role,
          firstName,
          lastName,
          email: currentUser?.email,
          avatar,
          phoneNumber,
          address,
        },
      };
      dispatch(updateUser(updatedUser));
      setEditPageVisible(false);
    }
  };
  return (
    <form className='form' onSubmit={editFormHandler}>
      <div className='form__group'>
        <h3 className='user-profile--edit__section__header'>First name</h3>
        <input
          placeholder='Change'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className='form__group'>
        <h3 className='user-profile--edit__section__header'>Last name</h3>
        <input
          placeholder='Change'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className='form__group'>
        <h3 className='user-profile--edit__section__header'>Phone number</h3>
        <input
          placeholder='Change'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className='form__group'>
        <h3 className='user-profile--edit__section__header'>Address</h3>
        <input
          placeholder='Change'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
    
      <div className='form__group'>
        <h3 className='user-profile--edit__section__header'>Avatar</h3>
        <input
          placeholder='Change'
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </div>
      <div>
        <button className='full-width-button__primary' type='submit'>
          Save
        </button>
        <button
          className='full-width-button__secondary'
          onClick={() => setEditPageVisible(false)}
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
