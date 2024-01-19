using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;

namespace Backend.Business.src.Implementations
{
    public class ProductService
        : BaseService<Product, ProductReadDto, ProductCreateDto, ProductUpdateDto>,
            IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public ProductService(
            IProductRepository productRepo,
            ICategoryRepository categoryRepository,
            IMapper mapper
        )
            : base(productRepo, mapper)
        {
            _productRepository = productRepo;
            _categoryRepository = categoryRepository;
        }

        public override async Task<ProductReadDto> CreateOne(ProductCreateDto entity)
        {
            var category = await _categoryRepository.GetOneById(entity.CategoryId);
            if (category == null)
            {
                throw CustomException.NotFoundException("Category not found.");
            }
            var product = _mapper.Map<Product>(entity);
            product.Category = category;
            var createdProduct = await _productRepository.CreateOne(product);
            return _mapper.Map<ProductReadDto>(createdProduct);
        }

        public override async Task<IEnumerable<ProductReadDto>> GetAll(QueryOptions queryOptions)
        {
            var products = await _productRepository.GetAll(queryOptions);
            var productDtos = _mapper.Map<IEnumerable<ProductReadDto>>(products);

            return productDtos;
        }

        public override async Task<ProductReadDto> UpdateOneById(
            Guid id,
            ProductUpdateDto updatedDto
        )
        {
            var foundItem = await _productRepository.GetOneById(id);
            var category = await _categoryRepository.GetOneById(updatedDto.CategoryId);

            if (category == null)
            {
                throw CustomException.NotFoundException("Category not found.");
            }

            if (foundItem != null)
            {
                foundItem.Inventory = updatedDto.Inventory;
                foundItem.Price = updatedDto.Price;
                foundItem.Category = category;
                foundItem.Description = updatedDto.Description;
                foundItem.ImageUrl = updatedDto.ImageUrl;
                foundItem.Title = updatedDto.Title;

                return _mapper.Map<ProductReadDto>(await _productRepository.UpdateOne(foundItem));
            }
            else
            {
                throw CustomException.NotFoundException("Item not found.");
            }
        }
    }
}
