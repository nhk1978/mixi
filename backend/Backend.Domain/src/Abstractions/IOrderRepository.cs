using Backend.Domain.src.Entities;

namespace Backend.Domain.src.Abstractions
{
    public interface IOrderRepository : IBaseRepository<Order>
    {
        Task<IEnumerable<Order>> GetAllOrdersByUserId(Guid userId); 
    }
}