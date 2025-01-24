using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Resraurant.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CartId { get; set; }

        [ForeignKey(nameof(CartId))]
        public virtual Cart Cart { get; set; }

        [Required]
        public int ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Food Food { get; set; } // Propriété de navigation vers Food

        [Required]
        public int Quantite { get; set; }

        [Required]
        public decimal PrixUnitaire { get; set; }

        [Required]
        public DateTime DateAjout { get; set; }
    }
}