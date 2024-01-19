namespace Backend.Business.src.Dtos
{
    public class OrderProductReadDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
    public class OrderProductCreateDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
    public class OrderProductUpdateDto
    {
        public int Quantity { get; set; }
    }
}