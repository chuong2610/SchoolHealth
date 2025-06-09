using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHealthCheckPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_StudentProfiles_StudentProfileId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_StudentProfileId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "StudentProfileId",
                table: "Students");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StudentProfileId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_StudentProfileId",
                table: "Students",
                column: "StudentProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_StudentProfiles_StudentProfileId",
                table: "Students",
                column: "StudentProfileId",
                principalTable: "StudentProfiles",
                principalColumn: "Id");
        }
    }
}
