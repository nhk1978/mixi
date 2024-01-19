using AutoMapper;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;

namespace Backend.Infrastructure.src.Configuration
{
    public class MapperProfile : Profile
    {
        public MapperProfile() {
            CreateMap<User, UserReadDto>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<UserCreateDto, User>();

            CreateMap<Product, ProductReadDto>();
            CreateMap<ProductReadDto, Product>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductCreateDto, Product>();

            CreateMap<Order, OrderReadDto>();
            CreateMap<OrderUpdateDto, Order>();
            CreateMap<OrderCreateDto, Order>();

            CreateMap<OrderProductCreateDto, OrderProduct>();
            CreateMap<OrderProductUpdateDto, OrderProduct>();
            CreateMap<OrderProduct, OrderProductReadDto>().ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Product.Id));

            CreateMap<Review, ReviewReadDto>();
            CreateMap<ReviewUpdateDto, Review>();
            CreateMap<ReviewCreateDto, Review>();

            CreateMap<Category, CategoryReadDto>();
            CreateMap<CategoryUpdateDto, Category>();
            CreateMap<CategoryCreateDto, Category>();
        }
        
    }
}