using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Abstractions
{
    public interface IOrderService : IBaseService<Order, OrderReadDto, OrderCreateDto, OrderUpdateDto>
    {
        Task<OrderReadDto> CreateOrder(Guid userId, OrderCreateDto entity);
        Task<IEnumerable<OrderReadDto>> GetAllOrdersByUserId(Guid userId);
        Task<bool> UpdateOrderConfirmation(Guid orderId);
        Task<bool> UpdateOrderPayment(Guid orderId);
    }
}