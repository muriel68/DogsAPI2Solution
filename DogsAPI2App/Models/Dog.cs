using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogsAPI2.Services.Models
{
    public class Dog
    {
        public Dog()
        {
        }
        public int DogID { get; set; }
        public string DogName { get; set; }
        public string[] Dogtype { get; set; }
    }
}
