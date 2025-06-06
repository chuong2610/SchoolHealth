using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseV12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Medications");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "MedicationDeclare",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "MedicationDeclare");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Medications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
