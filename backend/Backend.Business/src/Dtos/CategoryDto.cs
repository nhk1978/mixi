namespace Backend.Business.src.Dtos
{
    public class CategoryReadDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
    }

    public class CategoryCreateDto
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class CategoryUpdateDto
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}