namespace Backend.Domain.src.Entities
{
    public class Product : BaseEntityWithId
    {
        public string Title { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
        public Category Category { get; set; }
        public int Inventory {get; set; }
        public string ImageUrl { get; set; }
    }
}