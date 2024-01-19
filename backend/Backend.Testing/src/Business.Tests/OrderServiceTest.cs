using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Implementations;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Moq;

namespace Backend.Testing.src.Business.Tests
{
    public class OrderServiceTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrderProductService> _orderProductServiceMock;
        private readonly Mock<IOrderProductRepository> _orderProductRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly IOrderService _orderService;

        public OrderServiceTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _orderProductServiceMock = new Mock<IOrderProductService>();
            _orderProductRepositoryMock = new Mock<IOrderProductRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<OrderCreateDto, Order>();
                cfg.CreateMap<Order, OrderCreateDto>();
                cfg.CreateMap<Order, OrderReadDto>();
                cfg.CreateMap<OrderReadDto, Order>();
                cfg.CreateMap<User, UserReadDto>();
            });

            var mapper = config.CreateMapper();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                _userRepositoryMock.Object,
                _orderProductRepositoryMock.Object,
                _orderProductServiceMock.Object,
                mapper
            );
        }

        [Fact]
        public async Task CreateOne_ReturnOrderReadDto()
        {
            Guid userId = Guid.NewGuid();
            var user = new User();
            user.Id = userId;
            var createdOrder = new OrderCreateDto()
            {
                UserId = userId,
                Recipient = "Someone",
                PhoneNumber = "123345245",
                Email = "Someone@mail.com",
                Address = "123 street",
                Status = OrderStatus.Pending,
                OrderProducts = new List<OrderProduct>()
            };
            var mappedOrder = new Order()
            {
                User = user,
                Recipient = "Someone",
                PhoneNumber = "123345245",
                Email = "Someone@mail.com",
                Address = "123 street",
                Status = OrderStatus.Pending,
                OrderProducts = new List<OrderProduct>()
            };
            _orderRepositoryMock
                .Setup(repo => repo.CreateOne(It.IsAny<Order>()))
                .ReturnsAsync(mappedOrder);

            var result = await _orderService.CreateOne(createdOrder);

            Assert.NotNull(result);
            Assert.IsType<OrderReadDto>(result);

            _orderRepositoryMock.Verify(repo => repo.CreateOne(It.IsAny<Order>()), Times.Once());

            Assert.Equal(mappedOrder.User.Id, result.User.Id);
            Assert.Equal(mappedOrder.Recipient, result.Recipient);
            Assert.Equal(mappedOrder.Email, result.Email);
            Assert.Equal(mappedOrder.PhoneNumber, result.PhoneNumber);
            Assert.Equal(mappedOrder.Status, result.Status);
            Assert.Equal(mappedOrder.Address, result.Address);
            Assert.Equal(mappedOrder.OrderProducts, result.OrderProducts);
        }
    }
}
