using BeautyPoly.Data.Models;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoryController : Controller
    {
        CateRepo cateRepo;
        ProductRepo productRepo;
        public CategoryController(CateRepo cateRepo, ProductRepo productRepo)
        {
            this.cateRepo = cateRepo;
            this.productRepo = productRepo;

        }

        [Route("admin/categories")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("admin/categories/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Categories> list = cateRepo.GetAllCate(filter);
            return Json(list);
        }
        [HttpPost("admin/categories/create")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] Categories categories)
        {

           
            Categories cate = new Categories();
          
            if (categories.CateID > 0)
            {
               
                await cateRepo.UpdateAsync(categories);
            }
            else
            {
                var checkExists = await cateRepo.FirstOrDefaultAsync(p => p.CateCode.Trim() == categories.CateCode.Trim() && p.CateID != categories.CateID);
                if (checkExists != null)
                {
                    return Json("Mã thuộc tính đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
                }

                cate.CateCode = categories.CateCode;
                cate.CateName = categories.CateName;
                cate.IsDelete = categories.IsDelete;
                await cateRepo.InsertAsync(cate);
            }
            return Json(1);
        }

        [HttpDelete("admin/categories/delete")]
        public async Task<IActionResult> Delete([FromBody] int cateID)
        {

            await cateRepo.DeleteAsync(await cateRepo.GetByIdAsync(cateID));

            return Json(1);
        }

        [HttpPut("admin/categories/disablecate")]
        public async Task<IActionResult> Disable([FromBody] int cateID)
        {
            var cate = await cateRepo.GetByIdAsync(cateID);
            cate.IsDelete = true;
            await cateRepo.UpdateAsync(cate);
            return Json(1);
        }

        [HttpGet("admin/categories/checkUsage")]
        public IActionResult CheckRoleUsage(int cateId)
        {
            try
            {
                // Kiểm tra xem vai trò có đang được sử dụng bởi ít nhất một tài khoản hay không
                bool isUsed = IsCateUsed(cateId);

                // Trả về kết quả cho client
                return Json(isUsed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Có lỗi xảy ra: " + ex.Message);
            }
        }
        public  bool IsCateUsed(int cateID)
        {
            var sp = productRepo.GetAllSP("").ToList();

            bool isUsed = sp.Any(p => p.CateID == cateID);

            return isUsed;
        }
        [HttpPut("admin/categories/updateStatus")]
        public async Task<IActionResult> ChangeStatus([FromBody] int cateID)
        {
            try
            {
                var cate = await cateRepo.GetByIdAsync(cateID);
                cate.IsDelete = !cate.IsDelete;
                await cateRepo.UpdateAsync(cate);

                // Trả về kết quả thành công cho client
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Có lỗi xảy ra: " + ex.Message);
            }
        }
    }
}
