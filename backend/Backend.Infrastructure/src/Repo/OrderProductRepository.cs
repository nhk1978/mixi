using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Infrastructure.src.Database;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.src.Repo
{
    public class OrderProductRepository : BaseRepository<OrderProduct>, IOrderProductRepository
    {
        private readonly DatabaseContext _dbContext;
        private readonly DbSet<OrderProduct> _orderProducts;

        public OrderProductRepository(DatabaseContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
            _orderProducts = dbContext.OrderProducts;
        }

        public override async Task<OrderProduct> CreateOne(OrderProduct entity)
        {
            return await base.CreateOne(entity);
        }

        public async Task<IEnumerable<OrderProduct>> GetAllOrderProduct()
        {
            return await _orderProducts.Include(p=>p.Product).AsNoTracking().ToArrayAsync();
        }

        public async Task<IEnumerable<OrderProduct>> GetAllOrderProductForAnOrder(Guid orderId)
        {
            return await _orderProducts.Include(r=>r.Product).Where(orderProduct => orderProduct.Order.Id == orderId).ToArrayAsync();
        }

        public async Task<OrderProduct> GetOneByCompositionId(Guid orderId, Guid productId)
        {
            return await _orderProducts.FirstOrDefaultAsync(product => product.Product.Id == productId && product.Order.Id == orderId);
        }
    }
}