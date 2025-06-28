using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<MedicalEvent> MedicalEvents { get; set; }
        public DbSet<MedicalSupply> MedicalSupplies { get; set; }
        public DbSet<MedicalEventSupply> MedicalEventSupplies { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<HealthCheck> HealthChecks { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationStudent> NotificationStudents { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<MedicationDeclare> MedicationDeclares { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>()
           .HasIndex(s => s.StudentNumber)
           .IsUnique();



            modelBuilder.Entity<NotificationStudent>()
                .HasKey(nr => new { nr.NotificationId, nr.StudentId });

            modelBuilder.Entity<NotificationStudent>()
                .HasOne(nr => nr.Notification)
                .WithMany(n => n.NotificationStudents)
                .HasForeignKey(nr => nr.NotificationId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<NotificationStudent>()
                .HasOne(nr => nr.Student)
                .WithMany(s => s.NotificationStudents)
                .HasForeignKey(nr => nr.StudentId)
                .OnDelete(DeleteBehavior.Cascade); ;

            modelBuilder.Entity<MedicalEventSupply>()
                .HasKey(sc => new { sc.MedicalEventId, sc.MedicalSupplyId });

            modelBuilder.Entity<MedicalEventSupply>()
                .HasOne(sc => sc.MedicalEvent)
                .WithMany(s => s.MedicalEventSupplys)
                .HasForeignKey(sc => sc.MedicalEventId);

            modelBuilder.Entity<MedicalEventSupply>()
                .HasOne(sc => sc.MedicalSupply)
                .WithMany(c => c.MedicalEventSupplys)
                .HasForeignKey(sc => sc.MedicalSupplyId);

            modelBuilder.Entity<Student>()
               .HasOne(s => s.Profile)
               .WithOne(p => p.Student)
               .HasForeignKey<StudentProfile>(p => p.Id);

            modelBuilder.Entity<HealthCheck>()
                .HasOne(h => h.Nurse)
                .WithMany(u => u.HealthChecks)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalEvent>()
                .HasOne(h => h.Nurse)
                .WithMany(u => u.MedicalEvents)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Medication>()
                .HasOne(h => h.Nurse)
                .WithMany(u => u.Medications)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vaccination>()
               .HasOne(h => h.Nurse)
               .WithMany(u => u.Vaccinations)
               .HasForeignKey(h => h.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.CreatedBy)
                .WithMany(u => u.CreatedNotifications)
                .HasForeignKey(n => n.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.AssignedTo)
                .WithMany(u => u.AssignedNotifications)
                .HasForeignKey(n => n.AssignedToId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Class)
                .WithMany(c => c.Students)
                .HasForeignKey(s => s.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Medication>()
                .HasMany(m => m.MedicationDeclares)
                .WithOne(d => d.Medication)
                .HasForeignKey(d => d.MedicationId);

            // Giữ Cascade cho Student (xóa học sinh thì xóa luôn health check)
            // modelBuilder.Entity<HealthCheck>()
            //     .HasOne(h => h.Student)
            //     .WithMany(s => s.HealthChecks)
            //     .HasForeignKey(h => h.StudentId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // // Dùng Restrict cho Nurse (không được xóa nurse nếu còn liên quan)
            // modelBuilder.Entity<HealthCheck>()
            //     .HasOne(h => h.Nurse)
            //     .WithMany()
            //     .HasForeignKey(h => h.UserId)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<MedicalEvent>()
            //     .HasOne(m => m.Student)
            //     .WithMany(s => s.MedicalEvents)
            //     .HasForeignKey(m => m.StudentId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<MedicalEvent>()
            //     .HasOne(m => m.Nurse)
            //     .WithMany()
            //     .HasForeignKey(m => m.UserId)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<Medication>()
            //    .HasOne(m => m.Student)
            //    .WithMany(s => s.Medications)
            //    .HasForeignKey(m => m.StudentId)
            //    .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<Medication>()
            //     .HasOne(m => m.Nurse)
            //     .WithMany()
            //     .HasForeignKey(m => m.UserId)
            //     .OnDelete(DeleteBehavior.Restrict);    

            //  modelBuilder.Entity<Vaccination>()
            //     .HasOne(m => m.Student)
            //     .WithMany(s => s.Vaccinations)
            //     .HasForeignKey(m => m.StudentId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<Vaccination>()
            //     .HasOne(m => m.Nurse)
            //     .WithMany()
            //     .HasForeignKey(m => m.UserId)
            //     .OnDelete(DeleteBehavior.Restrict);

        }
    }
}