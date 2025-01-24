namespace Gestion_Resraurant.Models.DTO
{
    public class ReservationDTO
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int TableId { get; set; }
        public string UserId { get; set; }
    }
}