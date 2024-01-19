namespace Backend.Domain.src.Entities
{
    public class Review : BaseEntityWithId
    {
        public Product Product { get; set; }
        public User User { get; set; }
        public string Feedback { get; set; }
    }
}