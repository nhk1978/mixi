using AutoMapper;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Implementations
{
    public class CategoryService : BaseService<Category, CategoryReadDto, CategoryCreateDto, CategoryUpdateDto>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepo, IMapper mapper) : base(categoryRepo, mapper)
        {
            _categoryRepository = categoryRepo;
        }

        public override async Task<CategoryReadDto> UpdateOneById(Guid id, CategoryUpdateDto updatedDto)
        {
            var foundCategory = await _categoryRepository.GetOneById(id);

            if(foundCategory != null) {
                foundCategory.Name = updatedDto.Name;
                foundCategory.ImageUrl = updatedDto.ImageUrl;
                return _mapper.Map<CategoryReadDto>(await _categoryRepository.UpdateOne(foundCategory));
            } else {
                throw CustomException.NotFoundException("Category not found.");
            }
        }
    }
}