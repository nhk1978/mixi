using System.Text;
using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Implementations;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Moq;
using Xunit.Abstractions;

namespace src.Business.Tests
{
    public class UserServiceTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly IUserService _userService;


        public UserServiceTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<UserCreateDto, User>();
                cfg.CreateMap<User, UserReadDto>();
                cfg.CreateMap<UserReadDto, User>();
                cfg.CreateMap<UserUpdateDto, User>();
            });

            var mapper = config.CreateMapper();
            _userService = new UserService(_userRepositoryMock.Object, mapper);
        }

        [Fact]
        public async Task GetAll_ReturnListOfUserReadDtos()
        {
            var queryOptions = new QueryOptions();
            Guid user1Id = Guid.NewGuid();
            Guid user2Id = Guid.NewGuid();
            Guid user3Id = Guid.NewGuid();
            var users = new List<User>
            {
                new User
                {
                    Id = user1Id,
                    FirstName = "Anna",
                    LastName = "Le",
                    Email = "anna@mail.com",
                    PhoneNumber = "0123456787",
                    Avatar = "avatar.png",
                    Address = "129 AVC",
                    Password = "abc123",
                    Role = UserRole.Customer,
                    Salt = Encoding.UTF8.GetBytes("salt")
                },
                new User
                {
                    Id = user2Id,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john@example.com",
                    PhoneNumber = "1234567890",
                    Avatar = "john-avatar.png",
                    Address = "123 Main St",
                    Password = "abc1234",
                    Role = UserRole.Customer,
                    Salt = Encoding.UTF8.GetBytes("salt2")
                },
                new User
                {
                    Id = user2Id,
                    FirstName = "Joan",
                    LastName = "Doe",
                    Email = "joan@example.com",
                    PhoneNumber = "8234567890",
                    Avatar = "joan-avatar.png",
                    Address = "123 Main St",
                    Password = "abc1235",
                    Role = UserRole.Customer,
                    Salt = Encoding.UTF8.GetBytes("salt3")
                }
            };
            _userRepositoryMock
                .Setup(repo => repo.GetAll(queryOptions))
                .ReturnsAsync(users.AsQueryable());

            var result = await _userService.GetAll(queryOptions);

            Assert.NotNull(result);
            Assert.Equal(users.Count, result.Count());
            Assert.IsAssignableFrom<IEnumerable<UserReadDto>>(result);
            _userRepositoryMock.Verify(repo => repo.GetAll(queryOptions), Times.Once());
        }

        [Fact]
        public async Task GetOneById_ReturnUserReadDtos()
        {
            Guid user1Id = Guid.NewGuid();
            Guid user2Id = Guid.NewGuid();
            Guid user3Id = Guid.NewGuid();
            User user1 = new User
            {
                Id = user1Id,
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };
            User user2 = new User
            {
                Id = user2Id,
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                PhoneNumber = "1234567890",
                Avatar = "john-avatar.png",
                Address = "123 Main St",
                Password = "abc1234",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt2")
            };
            User user3 = new User
            {
                Id = user2Id,
                FirstName = "Joan",
                LastName = "Doe",
                Email = "joan@example.com",
                PhoneNumber = "8234567890",
                Avatar = "joan-avatar.png",
                Address = "123 Main St",
                Password = "abc1235",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt3")
            };
            var users = new List<User> { user1, user2, user3 };
            _userRepositoryMock.Setup(repo => repo.GetOneById(user1Id)).ReturnsAsync(user1);

            var result = await _userService.GetOneById(user1Id);

            Assert.NotNull(result);
            Assert.Equal(user1Id, result.Id);
            Assert.IsType<UserReadDto>(result);
            _userRepositoryMock.Verify(repo => repo.GetOneById(user1Id), Times.Once());
        }

        [Fact]
        public async Task DeleteOneById_FoundItem_ReturnsTrue()
        {
            Guid userId = Guid.NewGuid();

            var toBeDeletedUser = new User
            {
                Id = userId,
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };
            _userRepositoryMock
                .Setup(repo => repo.GetOneById(userId))
                .ReturnsAsync(toBeDeletedUser);

            var result = await _userService.DeleteOneById(userId);

            Assert.True(result);

            _userRepositoryMock.Verify(repo => repo.DeleteOneById(toBeDeletedUser), Times.Once());
        }

        [Fact]
        public async Task DeleteOneById_NotFoundItem_ReturnsFalse()
        {
            Guid userId = Guid.NewGuid();

            var toBeDeletedUser = new User
            {
                Id = userId,
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };
            _userRepositoryMock.Setup(repo => repo.GetOneById(userId)).ReturnsAsync((User)null);

            var result = await _userService.DeleteOneById(userId);

            Assert.False(result);

            _userRepositoryMock.Verify(repo => repo.DeleteOneById(toBeDeletedUser), Times.Never());
        }

        [Fact]
        public async Task UpdateOneById_FoundItem_ReturnsUserReadDto()
        {
            Guid userId = Guid.NewGuid();

            var toBeUpdatedUser = new User
            {
                Id = userId,
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };

            var updatedUserDto = new UserUpdateDto
            {
                FirstName = "Someone",
                LastName = "Nguyen",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC"
            };

            var updatedUser = new User
            {
                Id = userId,
                FirstName = "Someone",
                LastName = "Nguyen",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };

            _userRepositoryMock
                .Setup(repo => repo.GetOneById(userId))
                .ReturnsAsync(toBeUpdatedUser);

            _userRepositoryMock
                .Setup(repo => repo.UpdateOneById(It.IsAny<User>()))
                .ReturnsAsync(updatedUser);

            var result = await _userService.UpdateOneById(userId, updatedUserDto);

            Assert.NotNull(result);
            Assert.IsType<UserReadDto>(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("Someone", result.FirstName);
            Assert.Equal("Nguyen", result.LastName);

            _userRepositoryMock.Verify(repo => repo.GetOneById(userId), Times.Once());

            _userRepositoryMock.Verify(
                repo => repo.UpdateOneById(It.IsAny<User>()),
                Times.Once()
            );
        }

        [Fact]
        public async Task CreateOne_ValidUser_ReturnsUserReadDto()
        {
            UserCreateDto createdUser =
                new()
                {
                    FirstName = "Anna",
                    LastName = "Le",
                    Email = "anna@mail.com",
                    PhoneNumber = "0123456787",
                    Avatar = "avatar.png",
                    Address = "129 AVC",
                    Password = "abc123"
                };

            var mappedUser = new User()
            {
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };

            _userRepositoryMock
                .Setup(repo => repo.CreateOne(It.IsAny<User>()))
                .ReturnsAsync(mappedUser);

            var result = await _userService.CreateOne(createdUser);

            Assert.NotNull(result);
            Assert.IsType<UserReadDto>(result);

            _userRepositoryMock.Verify(repo => repo.CreateOne(It.IsAny<User>()), Times.Once());

            Assert.Equal(mappedUser.FirstName, result.FirstName);
            Assert.Equal(mappedUser.LastName, result.LastName);
            Assert.Equal(mappedUser.Email, result.Email);
            Assert.Equal(mappedUser.PhoneNumber, result.PhoneNumber);
            Assert.Equal(mappedUser.Avatar, result.Avatar);
            Assert.Equal(mappedUser.Address, result.Address);
            Assert.Equal(mappedUser.Role, result.Role);
        }

        [Fact]
        public async Task CreateAdmin_ValidUser_ReturnsUserReadDto()
        {
            UserCreateDto createdUser =
                new()
                {
                    FirstName = "Anna",
                    LastName = "Le",
                    Email = "anna@mail.com",
                    PhoneNumber = "0123456787",
                    Avatar = "avatar.png",
                    Address = "129 AVC",
                    Password = "abc123"
                };

            var mappedUser = new User()
            {
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Admin,
                Salt = Encoding.UTF8.GetBytes("salt")
            };

            _userRepositoryMock
                .Setup(repo => repo.CreateAdmin(It.IsAny<User>()))
                .ReturnsAsync(mappedUser);

            var result = await _userService.CreateAdmin(createdUser);

            Assert.NotNull(result);
            Assert.IsType<UserReadDto>(result);

            _userRepositoryMock.Verify(repo => repo.CreateAdmin(It.IsAny<User>()), Times.Once());

            Assert.Equal(mappedUser.FirstName, result.FirstName);
            Assert.Equal(mappedUser.LastName, result.LastName);
            Assert.Equal(mappedUser.Email, result.Email);
            Assert.Equal(mappedUser.PhoneNumber, result.PhoneNumber);
            Assert.Equal(mappedUser.Avatar, result.Avatar);
            Assert.Equal(mappedUser.Address, result.Address);
            Assert.Equal(mappedUser.Role, result.Role);
        }

        [Fact]
        public async Task UpdatePassword_UserFound_ReturnUserReadDto()
        {
            Guid userId = Guid.NewGuid();
            string newPassword = "newpassword";

            var foundUser = new User
            {
                Id = userId,
                FirstName = "Anna",
                LastName = "Le",
                Email = "anna@mail.com",
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };

            _userRepositoryMock.Setup(repo => repo.GetOneById(userId)).ReturnsAsync(foundUser);

            var hashedPassword = "hashedpassword";
            var salt = new byte[32];

            PasswordService.HashPassword(newPassword, out hashedPassword, out salt);
            foundUser.Password = hashedPassword;
            foundUser.Salt = salt;

            _userRepositoryMock
                .Setup(repo => repo.UpdatePassword(It.IsAny<User>()))
                .ReturnsAsync(foundUser);

            var result = await _userService.UpdatePassword(userId, newPassword);

            Assert.NotNull(result);
            Assert.IsType<UserReadDto>(result);

            _userRepositoryMock.Verify(repo => repo.GetOneById(userId), Times.Once());

            _userRepositoryMock.Verify(repo => repo.UpdatePassword(It.IsAny<User>()), Times.Once());

            Assert.Equal(userId, foundUser.Id);
        }

        [Fact]
        public async Task UpdatePassword_UserNotFound_ThrowsNotFoundException()
        {
            Guid userId = Guid.NewGuid();
            string newPassword = "newpassword";

            _userRepositoryMock.Setup(repo => repo.GetOneById(userId)).ReturnsAsync((User)null);

            await Assert.ThrowsAsync<CustomException>(async () =>
            {
                await _userService.UpdatePassword(userId, newPassword);
            });

            _userRepositoryMock.Verify(repo => repo.GetOneById(userId), Times.Once());

            _userRepositoryMock.Verify(
                repo => repo.UpdatePassword(It.IsAny<User>()),
                Times.Never()
            );
        }

        [Fact]
        public async Task FindOneByEmail_UserFound_ReturnUserReadDto()
        {
            Guid userId = Guid.NewGuid();
            string searchedEmail = "test@mail.com";
            var foundUser = new User
            {
                Id = userId,
                FirstName = "Anna",
                LastName = "Le",
                Email = searchedEmail,
                PhoneNumber = "0123456787",
                Avatar = "avatar.png",
                Address = "129 AVC",
                Password = "abc123",
                Role = UserRole.Customer,
                Salt = Encoding.UTF8.GetBytes("salt")
            };
            _userRepositoryMock
                .Setup(repo => repo.FindOneByEmail(searchedEmail))
                .ReturnsAsync(foundUser);

            var result = await _userService.FindOneByEmail(searchedEmail);

            Assert.NotNull(result);
            Assert.IsType<UserReadDto>(result);
            Assert.Equal(result.Email, searchedEmail);

            _userRepositoryMock.Verify(repo => repo.FindOneByEmail(searchedEmail), Times.Once());
        }

        [Fact]
        public async Task FindOneByEmail_UserNotFound_ThrowsNotFoundException()
        {
            string searchedEmail = "test@mail.com";

            _userRepositoryMock
                .Setup(repo => repo.FindOneByEmail(searchedEmail))
                .ReturnsAsync((User)null);

            await Assert.ThrowsAsync<CustomException>(async () =>
            {
                await _userService.FindOneByEmail(searchedEmail);
            });

            _userRepositoryMock.Verify(repo => repo.FindOneByEmail(searchedEmail), Times.Once());
        }
    }
}
