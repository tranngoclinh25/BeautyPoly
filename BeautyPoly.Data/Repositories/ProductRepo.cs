using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class ProductRepo : GenericRepo<Product>
    {
        public ProductRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Product> GetAllSP(string filter)
        {
            List<Product> spList = SQLHelper<Product>.ProcedureToList("spGetPro", new string[] { "@KeyWord" }, new object[] { filter });
            return spList;

        }
    }
}
