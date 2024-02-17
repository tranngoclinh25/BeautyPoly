using BeautyPoly.Common;
using BeautyPoly.Data.Models;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class CateRepo : GenericRepo<Categories>
    {
        public CateRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Categories> GetAllCate(string filter)
        {
            List<Categories> cateList = SQLHelper<Categories>.ProcedureToList("spGetCate", new string[] {"@KeyWord"}, new object[] {filter});
            return cateList;

        }
    }
}
