# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./
# Restore and build the project
WORKDIR /App/Backend.Infrastructure
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /App

# Copy published output from build stage
COPY --from=build-env /App/Backend.Infrastructure/out .

# Set environment variable for Release
ENV ASPNETCORE_ENVIRONMENT Release

# Specify the entry point for the container
CMD ["dotnet", "Backend.Infrastructure.dll"]
