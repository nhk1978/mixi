using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Implementations
{
    public class OrderProductService : BaseService<OrderProduct, OrderProductReadDto, OrderProductCreateDto, OrderProductUpdateDto>, IOrderProductService
    {
        private readonly IOrderProductRepository _orderProductRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOrderRepository _orderRepository;
        public OrderProductService(IOrderProductRepository orderProductRepo, IOrderRepository orderRepository, IProductRepository productRepository, IMapper mapper) : base(orderProductRepo, mapper)
        {
            _orderProductRepository = orderProductRepo;
            _productRepository = productRepository;
            _orderRepository = orderRepository;
        }

        public async Task<OrderProduct> CreateOrderProduct(OrderProduct entity)
        {
            var product = await _productRepository.GetOneById(entity.Product.Id);

            if (product == null) {
                throw CustomException.NotFoundException($"Product not found.");
            }

            if (product.Inventory < entity.Quantity) {
                throw new CustomException(409,"The quantity of the product is not enough for your order.");
            }

            product.Inventory -= entity.Quantity;

            await _productRepository.UpdateOne(product);

            var createdOrderProduct = await _orderProductRepository.CreateOne(entity);
            
            return createdOrderProduct;
        }

        public async Task<bool> DeleteOrderProduct(Guid orderId, Guid productId)
        {
           var foundOrderProduct = await _orderProductRepository.GetOneByCompositionId(orderId, productId);

            if (foundOrderProduct == null) {
                throw CustomException.NotFoundException("Order Product not found");
            }

            return await _orderProductRepository.DeleteOne(foundOrderProduct); 
        }

        public async Task<IEnumerable<OrderProductReadDto>> GetAllOrderProductForAnOrder(Guid orderId)
        {
            var order = await _orderRepository.GetOneById(orderId);

            if (order == null) {
                throw CustomException.NotFoundException("Order not found");
            }

            var orderProducts = await _orderProductRepository.GetAllOrderProductForAnOrder(orderId);
            
            return _mapper.Map<IEnumerable<OrderProductReadDto>>(orderProducts);
        }

        public async Task<OrderProductReadDto> GetOrderProductByIdComposition(Guid orderId, Guid productId)
        {
                   
            var order = await _orderRepository.GetOneById(orderId);

            if (order == null) {
                throw CustomException.NotFoundException("Order not found");
            }

            var orderProduct = order.OrderProducts.FirstOrDefault(product => product.Product.Id == productId && product.Order.Id == orderId);
            
            if(orderProduct == null) {
                throw CustomException.NotFoundException("OrderProduct not found");
            }

            var orderProductReadDto = _mapper.Map<OrderProductReadDto>(orderProduct);

            return orderProductReadDto;
        }

        public async Task<OrderProduct> UpdateOrderProduct(Guid orderId, Guid productId, OrderProductUpdateDto entityDto)
        {
            var foundOrderProduct = await _orderProductRepository.GetOneByCompositionId(orderId, productId);

            if (foundOrderProduct == null) {
                throw CustomException.NotFoundException("Order Product not found");
            } 

            var updatedOrderProduct = _mapper.Map<OrderProduct>(entityDto);
            updatedOrderProduct.Product = await _productRepository.GetOneById(productId);
            updatedOrderProduct.Order = await _orderRepository.GetOneById(orderId);
            updatedOrderProduct.Quantity = entityDto.Quantity;

            return await _orderProductRepository.UpdateOne(updatedOrderProduct);
        }
    }
}