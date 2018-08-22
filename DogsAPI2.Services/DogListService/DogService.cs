using RichBank.Services.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace RichBank.Services.DogListService
{
    public class DogService : IDogService
    {
        public object JsonConvert { get; private set; }

        public Dog Add(Dog item)
        {
            throw new NotImplementedException();
        }

        public bool Delete(string name)
        {
            throw new NotImplementedException();
        }

        public Dog Get(string dogName)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Dog> GetAll()
        {
            Dictionary<string, string[]> htmlAttributes;
            using (StreamReader r = new StreamReader("dogs.json"))
            {
                string json = r.ReadToEnd();
                htmlAttributes = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string[]>>(json); 
            }
            return null;
        }

        public bool Update(Dog item)
        {
            throw new NotImplementedException();
        }
    }
}
