﻿using DogsAPI2.Services.DogListService;
using DogsAPI2.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            return View();
        }

        /// <summary>
        /// jqGrid datasource for dogs
        /// </summary>
        /// <param name="sord"></param>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="searchString"></param>
        /// <returns></returns>
        public ActionResult DogDatasource(string id, string sidx, string sord, int page, int rows, string searchString, string sopt)
        {
            try { 
            IEnumerable<Dog> Results = _dogService.GetAll();

            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;

            //#4 Get Total Row Count
            int totalRecords = Results.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);

            //#5 Setting Sorting
            if (sord != null)
            {
                if (sord.ToUpper() == "DESC")
                {
                    Results = Results.OrderByDescending(s => s.DogName);
                    Results = Results.Skip(pageIndex * pageSize).Take(pageSize);
                }
                else
                {
                    Results = Results.OrderBy(s => s.DogName);
                    Results = Results.Skip(pageIndex * pageSize).Take(pageSize);
                }
            }
            //#6 Setting Search
            if (!string.IsNullOrEmpty(searchString))
            {
                Results = Results.Where(m => m.DogName.Contains(searchString));
            }
            //#7 Sending Json Object to View.
            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = Results
            };

            return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return Json("Couldn't get list", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetDog(string Dogname)
        {
            try { 
            Dog Dog = _dogService.Get(Dogname);
            return Json(Dog, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return Json("Couldn't get dog", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CreateDog(Dog dog)
        {
            dog.Dogtype = dog.Dogtype.Where(x => !string.IsNullOrEmpty(x.ToLower())).ToArray();
            StringBuilder msg = new StringBuilder();
            try
            {
                if (ModelState.IsValid)
                {
                    _dogService.Add(dog);
                    return Json("Saved Successfully", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errorList = (from item in ModelState
                                     where item.Value.Errors.Any()
                                     select item.Value.Errors[0].ErrorMessage).ToList();

                    return Json(errorList, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                var errormessage = "Error occured: " + ex.Message;
                return Json(errormessage, JsonRequestBehavior.AllowGet);
            }
        }

        public string EditDog(Dog dog)
        {
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    _dogService.Update(dog);
                    msg = "Saved Successfully";
                }
                else
                {
                    msg = "Some Validation ";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }

        public string DeleteDogType(string Dogname, string Dogtype)
        {
            Dog dog = _dogService.Get(Dogname);
            string dogtypestring = dog.Dogtype[0].ToString();
            dogtypestring = dogtypestring.Replace(Dogtype, String.Empty);
            dog.Dogtype = dogtypestring.Split(',').Select(a => a).ToArray();
            dog.Dogtype = dog.Dogtype.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            _dogService.Update(dog);
            return "Dog type deleted";
        }

        public string AddDogType(string Dogname, string Dogtype)
        {
            try
            {
                Dog dog = _dogService.Get(Dogname);
                string dogtypestring = "";
                if (dog.Dogtype.Length > 0)
                {
                    dogtypestring = dog.Dogtype[0].ToString();
                    dogtypestring = dogtypestring += "," + Dogtype;
                }
                else
                {
                    dogtypestring = Dogtype;
                }
                dog.Dogtype = dogtypestring.Split(',').Select(a => a).ToArray();
                dog.Dogtype = dog.Dogtype.Where(x => !string.IsNullOrEmpty(x)).ToArray();
                _dogService.Update(dog);
                return "Dog type added";
            }catch(Exception ex)
            {
                log.Error(ex);
                return "Dog type not added";
            }
        }

        public string DeleteDog(string Dogname)
        {
            try { 
            _dogService.Delete(Dogname);
            return "Deleted successfully";
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "Dog not deleted";
            }
        }
    }
}