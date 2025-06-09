using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDecimalPrecisionToHealthCheck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentProfiles_Students_StudentId",
                table: "StudentProfiles");

            migrationBuilder.DropIndex(
                name: "IX_StudentProfiles_StudentId",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "StudentProfiles");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "StudentId",
                table: "StudentProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StudentProfiles_StudentId",
                table: "StudentProfiles",
                column: "StudentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentProfiles_Students_StudentId",
                table: "StudentProfiles",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
