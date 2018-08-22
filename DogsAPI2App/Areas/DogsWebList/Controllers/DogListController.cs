using DogsAPI2.Services.DogListService;
using DogsAPI2.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DogsAPI2.Areas.DogsWebList.Controllers
{


    public class DogListController : Controller
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        // GET: DogsWebList/DogList
        private readonly IDogService _dogService;

        public DogListController(IDogService dogsService)
        {
            this._dogService = dogsService;
        }

        // GET: DogWebList/DogList
        public ActionResult Index()
        {
            IEnumerable<Dog> dogList = _dogService.GetAll();

            Dog d = new Dog { DogName = "Big Shaggy Test Dog", Dogtype = new string[]{ "Big Test Type Of Dog", "And another" } };
            _dogService.Add(d);

            IEnumerable<Dog> dogList1 = _dogService.GetAll();

          //  _dogService.Delete(d.DogName);

            IEnumerable<Dog> dogList2 = _dogService.GetAll();

            string[] dogtypes = _dogService.GetAllDogtypes();

            return View();
        }
    }
}