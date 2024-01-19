using System.Security.Claims;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller.src.Controllers
{
    public class OrderController
        : CrudController<Order, OrderReadDto, OrderCreateDto, OrderUpdateDto>
    {
        private readonly IOrderService _orderService;
        private readonly IOrderProductService _orderProductService;
        private readonly IAuthorizationService _authorizationService;

        public OrderController(
            IOrderService orderService,
            IAuthorizationService authorizationService,
            IOrderProductService orderProductService
        )
            : base(orderService)
        {
            _orderService = orderService;
            _authorizationService = authorizationService;
            _orderProductService = orderProductService;
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll(
            [FromQuery] QueryOptions queryOptions
        )
        {
            return Ok(await _orderService.GetAll(queryOptions));
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<IEnumerable<OrderReadDto>>> GetOneById(
            [FromRoute] Guid id
        )
        {
            return Ok(await _orderService.GetOneById(id));
        }

        [Authorize]
        [HttpGet("private")]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAllOrdersByUserId()
        {
            var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Ok(await _orderService.GetAllOrdersByUserId(new Guid(id)));
        }

        [Authorize(Policy = "AdminRole")]
        [HttpGet("{id:Guid}/products")]
        public async Task<ActionResult<IEnumerable<OrderProductReadDto>>> GetAllProductsByOrder(
            [FromRoute] Guid id
        )
        {
            var orderProducts = await _orderProductService.GetAllOrderProductForAnOrder(id);

            return Ok(orderProducts);
        }

        [Authorize]
        public override async Task<ActionResult<OrderReadDto>> CreateOne(
            [FromBody] OrderCreateDto dto
        )
        {
            var userId = new Guid(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var createdObject = await _orderService.CreateOrder(userId, dto);
            return CreatedAtAction(nameof(CreateOne), createdObject);
        }

        [Authorize]
        public override async Task<ActionResult<OrderReadDto>> UpdateOneById(
            [FromRoute] Guid id,
            [FromBody] OrderUpdateDto update
        )
        {
            var user = HttpContext.User;
            var order = await _orderService.GetOneById(id);

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                order,
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                return await base.UpdateOneById(id, update);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize]
        [HttpPatch("{id:Guid}/order-confirmation")]
        public async Task<ActionResult<bool>> UpdateConfirmOrder(
            [FromRoute] Guid id
        )
        {
            var user = HttpContext.User;
            var order = await _orderService.GetOneById(id);

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                order.UserId.ToString(),
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                return await _orderService.UpdateOrderConfirmation(id);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize]
        [HttpPatch("{id:Guid}/payment-process")]
        public async Task<ActionResult<bool>> UpdatePayment(
            [FromRoute] Guid id
        )
        {
            var user = HttpContext.User;
            var order = await _orderService.GetOneById(id);

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                order.UserId.ToString(),
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                return await _orderService.UpdateOrderPayment(id);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<bool>> DeleteOneById([FromRoute] Guid id) {
            return StatusCode(204, await _orderService.DeleteOneById(id));
        }
    }
}
