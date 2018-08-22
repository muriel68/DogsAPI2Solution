using RichBank.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RichBank.Services.DogListService
{
    public interface IDogService
    {
        IEnumerable<Dog> GetAll();

        Dog Get(string dogName);

        Dog Add(Dog item);

        bool Update(Dog item);

        bool Delete(string name);
    }
}
