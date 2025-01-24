using System.ComponentModel.DataAnnotations;

namespace Gestion_Resraurant.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime DateCreation { get; set; }

        public virtual ICollection<CartItem> CartItems { get; set; }

    }
}
