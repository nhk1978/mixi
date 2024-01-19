using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Implementations
{
    public class UserService : BaseService<User,  UserReadDto, UserCreateDto, UserUpdateDto>, IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepo, IMapper mapper) : base(userRepo, mapper)
        {
            _userRepository = userRepo;
        }

        public async Task<bool> UpdatePassword(Guid id, string newPassword)
        {
            var foundUser = await _userRepository.GetOneById(id);
            if (foundUser == null) {
                throw CustomException.NotFoundException("User not found.");
            }
            PasswordService.HashPassword(newPassword, out var hashedPassword, out var salt);
            foundUser.Password = hashedPassword;
            foundUser.Salt = salt;
            return await _userRepository.UpdatePassword(foundUser);
        }

        public override async Task<UserReadDto> CreateOne(UserCreateDto entity) {
            var newEntity = _mapper.Map<User>(entity);
            if(!EmailService.IsEmailValid(newEntity.Email)) {
                throw CustomException.NotValidFormat("Email's format is wrong.");
            }
            PasswordService.HashPassword(entity.Password, out var hashedPassword, out var salt);
            newEntity.Password = hashedPassword;
            newEntity.Salt = salt;
            newEntity.Role = UserRole.Customer;
            var createdEntity = await _userRepository.CreateOne(newEntity);
            return _mapper.Map<UserReadDto>(createdEntity);
        }

        public async Task<UserReadDto> CreateAdmin(UserCreateDto entity)
        {
            var newEntity = _mapper.Map<User>(entity);
            if(!EmailService.IsEmailValid(newEntity.Email)) {
                throw CustomException.NotValidFormat("Email's format is wrong.");
            }
            PasswordService.HashPassword(entity.Password, out var hashedPassword, out var salt);
            newEntity.Password = hashedPassword;
            newEntity.Salt = salt;
            newEntity.Role = UserRole.Admin;
            var createdEntity = await _userRepository.CreateAdmin(newEntity);
            return _mapper.Map<UserReadDto>(createdEntity);
        }

        public async Task<UserReadDto> FindOneByEmail(string email)
        {
            var foundUser = await _userRepository.FindOneByEmail(email);
            if(foundUser == null) {
                throw CustomException.NotFoundException("Email has not been registered.");
            }
            return _mapper.Map<UserReadDto>(foundUser);
        }

        public override async Task<UserReadDto> UpdateOneById(Guid id, UserUpdateDto updatedDto)
        {
            var foundItem = await _userRepository.GetOneById(id);
            if(foundItem != null) {
                foundItem.FirstName = updatedDto.FirstName;
                foundItem.LastName = updatedDto.LastName;
                foundItem.Avatar = updatedDto.Avatar;
                foundItem.Address = updatedDto.Address;
                foundItem.PhoneNumber = updatedDto.PhoneNumber;

                return _mapper.Map<UserReadDto>(await _userRepository.UpdateOne(foundItem));
            } else {
                throw CustomException.NotFoundException("Item not found.");
            }
        }
    }
}