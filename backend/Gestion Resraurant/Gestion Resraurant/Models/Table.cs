using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Gestion_Resraurant.Models
{
    public class Table
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public decimal Number { get; set; }

        [Required]
        public decimal Capacity { get; set; }

        [Required]
        public bool Availability { get; set; }

        public ICollection<Reservation>? Reservations { get; set; }
    }
}