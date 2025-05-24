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
        public DbSet<MedicalSupply> MedicalSupplys { get; set; }
        public DbSet<MedicalEventSupply> MedicalEventSupplys { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<HealthCheck> HealthChecks { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

            // Giữ Cascade cho Student (xóa học sinh thì xóa luôn health check)
            modelBuilder.Entity<HealthCheck>()
                .HasOne(h => h.Student)
                .WithMany(s => s.HealthChecks)
                .HasForeignKey(h => h.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Dùng Restrict cho Nurse (không được xóa nurse nếu còn liên quan)
            modelBuilder.Entity<HealthCheck>()
                .HasOne(h => h.Nurse)
                .WithMany()
                .HasForeignKey(h => h.NurseId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalEvent>()
                .HasOne(m => m.Student)
                .WithMany(s => s.MedicalEvents)
                .HasForeignKey(m => m.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MedicalEvent>()
                .HasOne(m => m.Nurse)
                .WithMany()
                .HasForeignKey(m => m.NurseId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Medication>()
               .HasOne(m => m.Student)
               .WithMany(s => s.Medications)
               .HasForeignKey(m => m.StudentId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Medication>()
                .HasOne(m => m.Nurse)
                .WithMany()
                .HasForeignKey(m => m.NurseId)
                .OnDelete(DeleteBehavior.Restrict);    
                
             modelBuilder.Entity<Vaccination>()
                .HasOne(m => m.Student)
                .WithMany(s => s.Vaccinations)
                .HasForeignKey(m => m.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Vaccination>()
                .HasOne(m => m.Nurse)
                .WithMany()
                .HasForeignKey(m => m.NurseId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}