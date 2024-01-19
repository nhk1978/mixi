namespace Backend.Domain.src.Entities
{
    public class Category : BaseEntityWithId
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
    }
}