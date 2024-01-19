using Backend.Business.src.Dtos;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Abstractions
{
    public interface IOrderProductService: IBaseService<OrderProduct,OrderProductReadDto, OrderProductCreateDto, OrderProductUpdateDto>
    {
        Task<OrderProduct> CreateOrderProduct(OrderProduct entity);
        Task<OrderProduct> UpdateOrderProduct(Guid orderId, Guid productId, OrderProductUpdateDto entityDto);
        Task<bool> DeleteOrderProduct(Guid orderId, Guid productId);
        Task<IEnumerable<OrderProductReadDto>> GetAllOrderProductForAnOrder(Guid orderId);
        Task<OrderProductReadDto> GetOrderProductByIdComposition(Guid orderId, Guid productId);
    }
}