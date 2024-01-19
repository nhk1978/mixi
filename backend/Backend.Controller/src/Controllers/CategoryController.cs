using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controller.src.Controllers
{
    [ApiController]
    [Route("api/v1/categories")]
    public class CategoryController : CrudController<Category, CategoryReadDto, CategoryCreateDto, CategoryUpdateDto>
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService) : base(categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize(Policy = "AdminRole")]
        [HttpPost]
        public override async Task<ActionResult<CategoryReadDto>> CreateOne([FromBody] CategoryCreateDto dto) {
            var createdObject = await _categoryService.CreateOne(dto);
            return Ok(createdObject);
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<CategoryReadDto>> UpdateOneById ([FromRoute] Guid id, [FromBody] CategoryUpdateDto update) {
            var updatedObject = await _categoryService.UpdateOneById(id, update);
            return Ok(updatedObject);
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<bool>> DeleteOneById([FromRoute] Guid id) {
            return StatusCode(204, await _categoryService.DeleteOneById(id));
        }
    }
}