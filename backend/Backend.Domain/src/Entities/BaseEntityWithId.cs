namespace Backend.Domain.src.Entities
{
    public class BaseEntityWithId : BaseEntity
    {
        private Guid _id;
        public Guid Id {
            get { return _id; }
            set {_id = value; }
        }
    }
}