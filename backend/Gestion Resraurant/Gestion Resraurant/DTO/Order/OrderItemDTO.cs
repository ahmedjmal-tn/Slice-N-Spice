namespace Gestion_Resraurant.DTO.Order
{
    public class OrderItemDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ItemId { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public DateTime DateAjout { get; set; }
    }
}
