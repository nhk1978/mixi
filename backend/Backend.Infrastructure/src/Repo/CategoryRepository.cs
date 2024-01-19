using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Backend.Infrastructure.src.Database;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.src.Repo
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        private readonly DbSet<Category> _categories;
        private readonly DatabaseContext _databaseContext;

        public CategoryRepository(DatabaseContext dbContext)
            : base(dbContext)
        {
            _databaseContext = dbContext;
            _categories = dbContext.Categories;
        }

        public override async Task<IEnumerable<Category>> GetAll(QueryOptions queryOptions)
        {
            IQueryable<Category> query = _categories;

            if (!string.IsNullOrWhiteSpace(queryOptions.Search))
            {
                query = query.Where(
                    category =>
                        category.Name.ToLower().Contains(queryOptions.Search.ToLower())
                );
            }

            if (queryOptions.OrderByAscending && queryOptions.OrderByDescending)
            {
                throw new CustomException(
                    400,
                    "Both OrderByAscending and OrderByDescending cannot be true."
                );
            }
            else if (queryOptions.OrderByAscending)
            {
                query = query.OrderBy(category => category.Name);
            }
            else if (queryOptions.OrderByDescending)
            {
                query = query.OrderByDescending(category => category.Name);
            }

            if (queryOptions.PageNumber == 0)
            {
                return query;
            }
            else
            {
                query = query
                    .Skip((queryOptions.PageNumber - 1) * queryOptions.ItemPerPage)
                    .Take(queryOptions.ItemPerPage);
            }

            return await query.ToArrayAsync();
        }
    }
}
