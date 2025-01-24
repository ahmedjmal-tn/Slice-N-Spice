using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Resraurant.Models
{
    public class Food
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required] // Propriété pour lier à une catégorie
        public int CategorieId { get; set; }
        // Propriété de navigation vers la catégorie
        [ForeignKey(nameof(CategorieId))]

        public virtual Categorie? Categorie { get; set; }
        [MaxLength(255)]
        public string? ImageUrl { get; set; } // Nouvelle propriété pour l'URL de l'image
    }
}
