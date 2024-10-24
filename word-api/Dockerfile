# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore the dependencies
COPY ["RandomWordApi.csproj", "./"]
RUN dotnet restore "RandomWordApi.csproj"

# Copy the rest of the application code
COPY . .
WORKDIR "/src"
RUN dotnet build "RandomWordApi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "RandomWordApi.csproj" -c Release -o /app/publish

# Final stage - create the image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the port your application listens on
EXPOSE 5000
ENTRYPOINT ["dotnet", "RandomWordApi.dll"]

