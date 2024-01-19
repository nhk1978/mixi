using Backend.Domain.src.Entities;

namespace Backend.Business.src.Dtos
{
    public class ReviewReadDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string Feedback { get; set; }
    }

    public class ReviewCreateDto
    {
        public Guid ProductId { get; set; }
        public string Feedback { get; set; }
    }

    public class ReviewUpdateDto
    {
        public string Feedback { get; set; }
    }
}
