using System;

namespace Gestion_Resraurant.Models.DTO
{
    public class CartItemDTO
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int ItemId { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public DateTime DateAjout { get; set; }

    }
}