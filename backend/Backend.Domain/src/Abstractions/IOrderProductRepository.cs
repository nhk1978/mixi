using Backend.Domain.src.Entities;

namespace Backend.Domain.src.Abstractions
{
    public interface IOrderProductRepository : IBaseRepository<OrderProduct>
    {
        Task<IEnumerable<OrderProduct>> GetAllOrderProduct();
        Task<OrderProduct> GetOneByCompositionId(Guid orderId, Guid productId);
        Task<IEnumerable<OrderProduct>> GetAllOrderProductForAnOrder(Guid orderId);
    }
}