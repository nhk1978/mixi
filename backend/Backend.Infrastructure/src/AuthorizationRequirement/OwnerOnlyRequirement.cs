using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Infrastructure.src
{
    public class OwnerOnlyRequirementHandler : AuthorizationHandler<OwnerOnlyRequirement, string>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OwnerOnlyRequirement requirement,
            string resource
        )
        {
            var authenticatedUser = context.User;
            var userId = authenticatedUser.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            Console.WriteLine($"userId: {userId}, resource: {resource}");
            if (userId == resource)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }

    public class OwnerOnlyRequirement : IAuthorizationRequirement { }
    
}
