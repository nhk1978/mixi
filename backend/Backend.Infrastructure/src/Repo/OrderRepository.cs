using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Backend.Infrastructure.src.Database;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.src.Repo
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        private readonly DbSet<Order> _orders;
        private readonly DatabaseContext _dbContext;

        public OrderRepository(DatabaseContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
            _orders = dbContext.Orders;
        }

        public override async Task<Order> CreateOne(Order entity)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    await _orders.AddAsync(entity);
                    await _dbContext.SaveChangesAsync();

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            return entity;
        }

        public override async Task<Order> UpdateOne(Order updatedEntity)
        {
            _orders.Update(updatedEntity);
            await _dbContext.SaveChangesAsync();
            return updatedEntity;
        }

        public override async Task<IEnumerable<Order>> GetAll(QueryOptions queryOptions)
        {
            IQueryable<Order> query = _orders;

            if (!string.IsNullOrWhiteSpace(queryOptions.Search))
            {
                query = query
                    .Include(q => q.OrderProducts)
                    .Where(
                        order =>
                            order.OrderProducts.Any(
                                orderProduct =>
                                    orderProduct.Product.Title
                                        .ToLower()
                                        .Contains(queryOptions.Search.ToLower())
                            )
                    );
            }

            if (queryOptions.OrderByAscending && queryOptions.OrderByDescending)
            {
                throw new CustomException(
                    400,
                    "Both OrderByAscending and OrderByDescending cannot be true."
                );
            }
            else if (queryOptions.OrderByAscending)
            {
                query = query.OrderBy(order => order.CreatedAt);
            }
            else if (queryOptions.OrderByDescending)
            {
                query = query.OrderByDescending(order => order.CreatedAt);
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

            return await query.Include(r => r.User).Include(r => r.OrderProducts).ToArrayAsync();
        }

        public override async Task<Order> GetOneById(Guid id)
        {
            return await _orders
                .Include(r => r.User)
                .Include(r => r.OrderProducts)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllOrdersByUserId(Guid userId)
        {
            IQueryable<Order> query = _orders;
            return await query.Include(r => r.User).Include(r => r.OrderProducts).Where(o=>o.User.Id == userId).ToArrayAsync();
        }
    }
}
