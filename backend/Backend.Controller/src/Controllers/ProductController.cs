using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controller.src.Controllers
{
    public class ProductController : CrudController<Product, ProductReadDto, ProductCreateDto, ProductUpdateDto>
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService) : base(productService)
        {
            _productService = productService;
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<ProductReadDto>> CreateOne([FromBody] ProductCreateDto dto) {
            var createdObject = await _productService.CreateOne(dto);
            return Ok(createdObject);
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<ProductReadDto>> UpdateOneById ([FromRoute] Guid id, [FromBody] ProductUpdateDto update) {
            var updatedObject = await _productService.UpdateOneById(id, update);
            return Ok(updatedObject);
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<bool>> DeleteOneById([FromRoute] Guid id) {
            return StatusCode(204, await _productService.DeleteOneById(id));
        }
    }
}