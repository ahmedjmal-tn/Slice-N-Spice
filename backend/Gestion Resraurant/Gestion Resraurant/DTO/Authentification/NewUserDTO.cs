using System.ComponentModel.DataAnnotations;

namespace E_Training.DTO
{
    public class NewUserDTO
    {
        public string Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Nom { get; set; }

        [Required]
        public string Prenom { get; set; }

        [Required]
        public string Role { get; set; }
    }
}