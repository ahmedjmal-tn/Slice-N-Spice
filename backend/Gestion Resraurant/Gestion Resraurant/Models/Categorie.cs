using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Gestion_Resraurant.Models
{
    public class Categorie
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public ICollection<Food>? Foods { get; set; }
    }
}