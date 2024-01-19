using Backend.Domain.src.Entities;

namespace Backend.Domain.src.Abstractions
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> CreateAdmin(User user);
        Task<bool> UpdatePassword(User user);
        Task<User?> FindOneByEmail(string email);
    }
}