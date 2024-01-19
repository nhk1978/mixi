using Microsoft.AspNetCore.Authorization;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;
using Microsoft.AspNetCore.Mvc;
using Backend.Domain.src.Shared;
using System.Security.Claims;

namespace Backend.Controller.src.Controllers
{
    public class UserController : CrudController<User, UserReadDto, UserCreateDto, UserUpdateDto>
    {
        private readonly IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
        public UserController(IUserService userService, IAuthorizationService authorizationService) : base(userService) {
            _userService = userService;
            _authorizationService = authorizationService;
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<IEnumerable<UserReadDto>>> GetAll([FromQuery] QueryOptions queryOptions) {
            return Ok(await _userService.GetAll(queryOptions));
        }

        [Authorize(Policy = "AdminRole")]
        [HttpPost("admin")]
        public async Task<ActionResult<UserReadDto>> CreateAdmin([FromBody] UserCreateDto dto) {
            var createdObject = await _userService.CreateAdmin(dto);
            return CreatedAtAction(nameof(CreateAdmin), createdObject);
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetProfile() {
            var id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Ok(await _userService.GetOneById(new Guid(id)));
        }

        [Authorize]
        [HttpPatch("{id:Guid}/change-password")]
        public async Task<ActionResult<UserReadDto>> UpdatePassword(
            [FromRoute] Guid id,
            [FromBody] UpdatePasswordDto newPassword
        )
        {
            var user = HttpContext.User;
            var userId = id.ToString();

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                userId,
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                var updatedObject = await _userService.UpdatePassword(id, newPassword.Password);
                return Ok(updatedObject);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize(Policy = "AdminRole")]
        [HttpGet("{email}")]
        public async Task<ActionResult<UserReadDto>> GetUserByEmail(string email)
        { 
            return Ok(await _userService.FindOneByEmail(email));
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<IEnumerable<UserReadDto>>> GetOneById([FromRoute] Guid id) {
            return Ok(await _userService.GetOneById(id));
        }

        [Authorize]
        public override async Task<ActionResult<UserReadDto>> UpdateOneById ([FromRoute] Guid id, [FromBody] UserUpdateDto update) {
            var user = HttpContext.User;
            var userId = id.ToString();

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                userId,
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                var updatedObject = await _userService.UpdateOneById(id, update);
            return Ok(updatedObject);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize(Policy = "AdminRole")]
        public override async Task<ActionResult<bool>> DeleteOneById([FromRoute] Guid id) {
            return await base.DeleteOneById(id);
        }
    }
}