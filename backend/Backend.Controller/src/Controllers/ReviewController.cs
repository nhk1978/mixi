using Backend.Business.src.Abstractions;
using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controller.src.Controllers
{
    public class ReviewController
        : CrudController<Review, ReviewReadDto, ReviewCreateDto, ReviewUpdateDto>
    {
        private readonly IReviewService _reviewService;
        private readonly IAuthorizationService _authorizationService;

        public ReviewController(
            IReviewService reviewService,
            IAuthorizationService authorizationService
        )
            : base(reviewService)
        {
            _reviewService = reviewService;
            _authorizationService = authorizationService;
        }

        [Authorize]
        public override async Task<ActionResult<ReviewReadDto>> CreateOne(
            [FromBody] ReviewCreateDto dto
        )
        {
                var userId = new Guid(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var createdObject = await _reviewService.CreateOneReview(userId, dto);
                return Ok(createdObject);

        }

        [Authorize]
        public override async Task<ActionResult<ReviewReadDto>> UpdateOneById(
            [FromRoute] Guid id,
            [FromBody] ReviewUpdateDto dto
        )
        {
            var review = await _reviewService.GetOneById(id);
            var userId = review.UserId.ToString();
            var user = HttpContext.User;

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                userId,
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                var updatedObject = await _reviewService.UpdateOneById(id, dto);
                return Ok(updatedObject);
            }
            else
            {
                return new ForbidResult();
            }
        }

        [Authorize]
        [HttpDelete("{id:Guid}")]
        public override async Task<ActionResult<bool>> DeleteOneById([FromRoute] Guid id)
        {
            var review = await _reviewService.GetOneById(id);
            var userId = review.UserId.ToString();
            var user = HttpContext.User;

            var authorizeOwner = await _authorizationService.AuthorizeAsync(
                user,
                userId,
                "OwnerOnly"
            );
            if (authorizeOwner.Succeeded)
            {
                return StatusCode(204, await _reviewService.DeleteOneById(id));
            }
            else
            {
                return new ForbidResult();
            }
            
        }
    }
}
