using Backend.Domain.src.Shared;

namespace Backend.Domain.src.Abstractions
{
    public interface IBaseRepository<T> 
    {
        Task<IEnumerable<T>> GetAll(QueryOptions queryOptions);
        Task<T> GetOneById(Guid id);
        Task<T> CreateOne(T entity); 
        Task<T> UpdateOne(T updatedEntity);
        Task<bool> DeleteOne(T entity);
    }
}