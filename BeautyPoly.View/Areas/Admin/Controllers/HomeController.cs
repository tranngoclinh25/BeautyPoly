using BeautyPoly.Areas.Admin.Models;
using BeautyPoly.Common;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace BeautyPoly.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class HomeController : Controller
    {
        private BeautyPolyDbContext _dbcontext;
        public HomeController(BeautyPolyDbContext context)
        {
            _dbcontext = context;
        }

        //  [Authorize(Roles = "Admin")]
        [Route("admin", Name = "index")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");

            return View();
        }
        [Route("admin/login", Name = "Login")]
        public IActionResult AdminLogin()
        {
            return View();
        }

        [HttpPost]
        [Route("admin/login", Name = "Login")]
        public async Task<IActionResult> AdminLogin(LoginViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Accounts tk = _dbcontext.Accounts
                    .Include(p => p.Roles)
                    .SingleOrDefault(p => p.Email.ToLower() == model.Email.ToLower().Trim());

                    if (tk == null)
                    {
                        ModelState.AddModelError("", "Thông tin đăng nhập không đúng. Vui lòng thử lại.");

                        return View(model);
                    }
                    string password = string.IsNullOrEmpty(model.Password) ? "" : MaHoaMD5.EncryptPassword(model.Password);
                    //string pass = (model.Password.Trim());
                    // + kh.Salt.Trim()
                    if (tk.Password.Trim() != password)
                    {
                        ModelState.AddModelError("", "Thông tin đăng nhập không đúng. Vui lòng thử lại.");

                        return View(model);
                    }
                    //đăng nhập thành công


                    HttpContext.Session.SetInt32("AccountID", tk.AccountID);
                    //identity
                    var userClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, tk.FullName),
                        new Claim(ClaimTypes.Email, tk.Email),
                        new Claim("AccountID", tk.AccountID.ToString()),
                        new Claim("RoleID", tk.RoleID.ToString()),
                        new Claim(ClaimTypes.Role, tk.Roles.RoleName)
                    };
                    var grandmaIdentity = new ClaimsIdentity(userClaims, "User Identity");
                    var userPrincipal = new ClaimsPrincipal(new[] { grandmaIdentity });
                    await HttpContext.SignInAsync(userPrincipal);


                    // _notyfService.Success("Đăng nhập thành công");
                    return RedirectToAction("Index", "Home", new { Area = "Admin" });

                }
            }
            catch
            {
                ModelState.AddModelError("", "Đăng nhập thất bại vui lòng kiểm tra lại user name hoặc mật khẩu");
                return View();
            }

            ModelState.AddModelError("", "Đăng nhập thất bại vui lòng kiểm tra lại user name hoặc mật khẩu");
            return View();

        }

        [Route("logout", Name = "Logout")]
        public IActionResult AdminLogout()
        {
            try
            {
                HttpContext.SignOutAsync();
                HttpContext.Session.Remove("AccountId");
                return RedirectToAction("AdminLogin", "Home", new { Area = "Admin" });
            }
            catch
            {
                return RedirectToAction("AdminLogin", "Home", new { Area = "Admin" });
            }
        }

        public IActionResult DashBoard()
        {
            return View();
        }
        [HttpGet("admin/home/GetProductToDashboard")]
        public IActionResult GetProductToDashboard(int flag)
        {
            DateTime dateStart = DateTime.Today;
            DateTime dateEnd = DateTime.Today.AddHours(23).AddMinutes(59).AddSeconds(59);
            if (flag == 1)
            {
                dateStart = dateStart.AddDays(-1);
                dateEnd = dateEnd.AddDays(-1);
            }
            else if (flag == 2)
            {
                dateStart = dateStart.AddDays(-7);
            }
            else if (flag == 3)
            {
                dateStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0);
            }
            else if (flag == 4)
            {
                dateStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0).AddMonths(-1);
                dateEnd = dateStart.AddDays(DateTime.DaysInMonth(dateStart.Year, dateStart.Month) - 1).AddHours(23).AddMinutes(59).AddSeconds(59); ;
            }
            var list = SQLHelper<ProductViewDashboard>.ProcedureToList("spGetProductThongKe", new string[] { "@DateStart", "@DateEnd" }, new object[] { dateStart, dateEnd });
            return Json(list, new JsonSerializerOptions());
        }
        [HttpGet("admin/home/GetRevenueChart")]
        public IActionResult GetRevenueChart(int flag)
        {
            DateTime dateStart = DateTime.Today;
            DateTime dateEnd = DateTime.Today.AddHours(23).AddMinutes(59).AddSeconds(59);
            if (flag == 1)
            {
                dateStart = dateStart.AddDays(-1);
                dateEnd = dateEnd.AddDays(-1);
            }
            else if (flag == 2)
            {
                dateStart = dateStart.AddDays(-7);
            }
            else if (flag == 3)
            {
                dateStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0);
            }
            else if (flag == 4)
            {
                dateStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0).AddMonths(-1);
                dateEnd = dateStart.AddDays(DateTime.DaysInMonth(dateStart.Year, dateStart.Month) - 1).AddHours(23).AddMinutes(59).AddSeconds(59); ;
            }
            var list = SQLHelper<ProductViewDashboard>.ProcedureToList("spGetProductInMonth", new string[] { "@DateStart", "@DateEnd" }, new object[] { dateStart, dateEnd });
            return Json(list, new JsonSerializerOptions());
        }
        [HttpGet("admin/home/GetDataInDay")]
        public IActionResult GetDataInDay()
        {

            var model = SQLHelper<ProductViewDashboard>.ProcedureToModel("spGetDataInDay", null, null);
            return Json(model, new JsonSerializerOptions());
        }

    }
}
