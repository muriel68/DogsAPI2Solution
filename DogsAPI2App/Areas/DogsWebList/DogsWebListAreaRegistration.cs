using System.Web.Mvc;

namespace DogsAPI2.Areas.DogsWebList
{
    public class DogsWebListAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "DogsWebList";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "DogsWebList_default",
                "DogsWebList/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}