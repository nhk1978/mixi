using Backend.Domain.src.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Backend.Infrastructure.src.Database
{
    public class TimeStampInterceptor : SaveChangesInterceptor
    {
        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken) {
            var addedEntries = eventData.Context.ChangeTracker.Entries().Where(e=>e.State == EntityState.Added);
            
            foreach(var trackedEntry in addedEntries) {
                if(trackedEntry.Entity is BaseEntity entity) {
                    entity.CreatedAt = DateTime.Now;
                    entity.UpdatedAt = DateTime.Now;
                }
            }

            var updatedEntries = eventData.Context.ChangeTracker.Entries().Where(e=>e.State == EntityState.Modified);
            
            foreach(var trackedEntry in updatedEntries) {
                if(trackedEntry.Entity is BaseEntity entity) {
                    entity.CreatedAt = DateTime.Now;
                    entity.UpdatedAt = DateTime.Now;
                }
            }

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}