using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Domain.src.Shared;
using Backend.Infrastructure.src.Database;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.src.Repo
{
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        private readonly DbSet<Review> _reviews;
        private readonly DatabaseContext _dbContext;
        public ReviewRepository(DatabaseContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
            _reviews = dbContext.Reviews;
        }

        public override async Task<Review> GetOneById(Guid id)
        {
            return await _reviews.Include(r=>r.User).Include(r=>r.Product).FirstOrDefaultAsync(r=>r.Id==id); 
        }

        public override async Task<IEnumerable<Review>> GetAll(QueryOptions queryOptions)
        {
            IQueryable<Review> query = _reviews;

            if (!string.IsNullOrWhiteSpace(queryOptions.Search))
            {
                query = query.Where(
                    review =>
                        review.Product.Title.ToLower().Contains(queryOptions.Search.ToLower())
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
                query = query.OrderBy(review => review.CreatedAt);
            }
            else if (queryOptions.OrderByDescending)
            {
                query = query.OrderByDescending(review => review.CreatedAt);
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

            return await query.Include(r=>r.User).Include(r=>r.Product).ToArrayAsync();
        }

        public override async Task<Review> CreateOne(Review entity)
        {
            return await base.CreateOne(entity);
        }
    }
}