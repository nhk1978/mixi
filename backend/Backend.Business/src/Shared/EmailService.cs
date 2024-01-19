using System.Text.RegularExpressions;

namespace Backend.Business.src.Shared
{
    public class EmailService
    {
       public static bool IsEmailValid(string email) {
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }
    }
}