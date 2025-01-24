using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestion_Resraurant.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey(nameof(OrderId))]
        public virtual Order Order { get; set; }

        [Required]
        public int ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Food Food { get; set; }

        [Required]
        public int Quantite { get; set; }

        [Required]
        public decimal PrixUnitaire { get; set; }

        [Required]
        public DateTime DateAjout { get; set; }
    }
}
