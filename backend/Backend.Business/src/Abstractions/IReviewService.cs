using Backend.Business.src.Dtos;
using Backend.Domain.src.Entities;

namespace Backend.Business.src.Abstractions
{
    public interface IReviewService : IBaseService<Review, ReviewReadDto, ReviewCreateDto, ReviewUpdateDto>
    {
        Task<ReviewReadDto> CreateOneReview(Guid userId, ReviewCreateDto dto);
    }
}