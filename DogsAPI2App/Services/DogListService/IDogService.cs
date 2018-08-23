using DogsAPI2.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogsAPI2.Services.DogListService
{
    public interface IDogService
    {
        IEnumerable<Dog> GetAll();

        Dog Get(string dogName);

        string[] GetAllDogtypes();

        bool Add(Dog item);

        bool Update(Dog item);

        bool Delete(int id);
    }
}
