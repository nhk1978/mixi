namespace Backend.Business.src.Shared
{
    public class CustomException : Exception
    {
        public int StatusCode { get; set; }
        public string ErrorMessage { get; set;}

        public CustomException(int statusCode = 500, string message = "Internal server error")
        {
            StatusCode = statusCode;
            ErrorMessage = message;
        }

        public static CustomException NotFoundException(string message = "Item cannot be found") {
            return new CustomException(404, message);
        }
        public static CustomException NotValidFormat(string message = "Invalid format of item") {
            return new CustomException(422, message);
        }
    }
}