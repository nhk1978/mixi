using System.Security.Claims;
using System.Text;
using Backend.Business.src.Abstractions;
using Backend.Business.src.Implementations;
using Backend.Business.src.Shared;
using Backend.Domain.src.Abstractions;
using Backend.Domain.src.Entities;
using Backend.Infrastructure.src;
using Backend.Infrastructure.src.Database;
using Backend.Infrastructure.src.Middleware;
using Backend.Infrastructure.src.Repo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var npgsqlBuilder = new NpgsqlDataSourceBuilder(connectionString);
npgsqlBuilder.MapEnum<UserRole>();
npgsqlBuilder.MapEnum<OrderStatus>();
var modifiedConnectionString = npgsqlBuilder.Build();

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.AddInterceptors(new TimeStampInterceptor());
    options.UseNpgsql(modifiedConnectionString)
           .UseSnakeCaseNamingConvention();
});

// Add Automapper DI
builder.Services.AddAutoMapper(typeof(Program).Assembly);

//Add DBContext
builder.Services.AddDbContext<DatabaseContext>();

// Add policy to handle service
builder.Services.AddSingleton<ErrorHandlerMiddleware>();
builder.Services.AddSingleton<IAuthorizationHandler, OwnerOnlyRequirementHandler>();

// Add service DI
builder.Services
    .AddScoped<IUserRepository, UserRepository>()
    .AddScoped<IUserService, UserService>()
    .AddScoped<IAuthService, AuthService>()
    .AddScoped<IProductRepository, ProductRepository>()
    .AddScoped<IProductService, ProductService>()
    .AddScoped<ICategoryRepository, CategoryRepository>()
    .AddScoped<ICategoryService, CategoryService>()
    .AddScoped<IReviewRepository, ReviewRepository>()
    .AddScoped<IReviewService, ReviewService>()
    .AddScoped<IOrderRepository, OrderRepository>()
    .AddScoped<IOrderService, OrderService>()
    .AddScoped<IOrderProductRepository, OrderProductRepository>()
    .AddScoped<IOrderProductService, OrderProductService>();

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "oauth2",
        new OpenApiSecurityScheme
        {
            Description = "Bearer token authentication",
            Name = "Authentication",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer"
        }
    );
    //Show the authorization required in ui
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Configure the route
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

// Configure the authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "ecommerce-backend",
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(
                // Encoding.UTF8.GetBytes("my-Ecommerce-app-key-0123456789-")
                Encoding.UTF8.GetBytes(builder.Configuration["ConnectionStrings:SecretKey"])
            ),
            ValidateIssuerSigningKey = true
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminRole", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"));
    options.AddPolicy("OwnerOnly", policy => policy.Requirements.Add(new OwnerOnlyRequirement()));
});

builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.WithOrigins("http://localhost:5071", "http://localhost:3005",  "https://shop-mixi-ecommerce.vercel.app")
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();
// app.UseCors(b =>
//     b.AllowAnyOrigin()
//     .AllowAnyMethod()
//     .AllowAnyHeader()

// );
app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
