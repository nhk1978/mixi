using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Backend.Infrastructure.src.Database;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.src.Repo
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly DbSet<User> _users;
        private readonly DatabaseContext _context;

        public UserRepository(DatabaseContext dbContext)
            : base(dbContext)
        {
            _users = dbContext.Users;
            _context = dbContext;
        }

        public override async Task<IEnumerable<User>> GetAll(QueryOptions queryOptions)
        {
            IQueryable<User> query = _users;

            if (!string.IsNullOrWhiteSpace(queryOptions.Search))
            {
                query = query.Where(
                    user =>
                        user.FirstName.ToLower().Contains(queryOptions.Search.ToLower())
                        || user.LastName.ToLower().Contains(queryOptions.Search.ToLower())
                );
            }

            if (queryOptions.OrderByAscending && queryOptions.OrderByDescending)
            {
                throw new CustomException(400, "Both OrderByAscending and OrderByDescending cannot be true.");
            }
            else if (queryOptions.OrderByAscending)
            {
                query = query.OrderBy(user => user.FirstName);
            }
            else if (queryOptions.OrderByDescending)
            {
                query = query.OrderByDescending(user => user.FirstName);
            }

            if (queryOptions.PageNumber == 0)
            {
                return query;
            }
            else
            {
                query = query
                    .Skip((queryOptions.PageNumber - 1) * queryOptions.ItemPerPage)
                    .Take(queryOptions.ItemPerPage);
            }

            return await query.ToArrayAsync();
        }

        public async Task<User> CreateAdmin(User user)
        {
            await _users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> FindOneByEmail(string email)
        {
            return await _users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> UpdatePassword(User user)
        {
            _users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public override async Task<User> CreateOne(User entity)
        {
            return await base.CreateOne(entity);
        }
    }
}
