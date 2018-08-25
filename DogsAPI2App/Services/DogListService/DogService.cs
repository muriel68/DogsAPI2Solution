using DogsAPI2.Services.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Reflection;

namespace DogsAPI2.Services.DogListService
{
    /// <summary>
    /// Dog service acts as data access layer for json file
    /// </summary>
    public class DogService : IDogService
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public bool Add(Dog item)
        {
            try
            {
                var dogs = GetAll().ToList();
                dogs.Add(item);
                WriteObjectToFile(dogs);
                return true;
            }catch(Exception ex)
            {
                log.Error(ex);
                return false;
            }
        }

        public bool Delete(string id)
        {
            try
            {
                var dogs = GetAll().ToList();
                dogs.Remove(dogs.Where(a => a.DogNameForUpdate == id).FirstOrDefault());
                WriteObjectToFile(dogs);
                return true;
            }catch(Exception ex)
            {
                log.Error(ex);
                return false;
            }
        }

        public Dog Get(string dogName)
        {
            try
            {
                var dogs = GetAll();
                Dog dog = dogs.Where(a => a.DogName == dogName).FirstOrDefault();
                return dog;
            }catch(Exception ex)
            {
                log.Error(ex);
                throw ex;
            }
        }

        /// <summary>
        /// Returns all dogs from json file mapped to objects
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Dog> GetAll()
        {
            Dictionary<string, string[]> dictDogs;
            string relativePath = AppDomain.CurrentDomain.BaseDirectory + "Models/";
            using (StreamReader r = new StreamReader(relativePath + "dogs.json"))
            {
                string json = r.ReadToEnd();
                dictDogs = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string[]>>(json);
            }

            IList<Dog> dogList = new List<Dog>();
            foreach(var key in dictDogs)
            {
                Dog dog = DictionaryToObject<Dog>(key);
                dog.DogNameForUpdate = key.Key; //This is temp as it will only be in scope for the users transaction
                dogList.Add(dog);
            }
            return dogList.AsEnumerable();
        }

        /// <summary>
        /// Gets all the available dog types from existing dogs
        /// </summary>
        /// <returns>string[]</returns>
        public string[] GetAllDogtypes()
        {
            var dogs = GetAll().ToList();
            var dogtypes = dogs.SelectMany(a => a.Dogtype).OrderBy(b => b).Distinct().ToArray();
            return dogtypes;
        }

        public bool Update(Dog item)
        {
            try
            {
                var dogs = GetAll().ToList();
                Dog updatingDog = dogs.Where(a => a.DogNameForUpdate == item.DogNameForUpdate).FirstOrDefault();
                updatingDog.DogName = item.DogName;
                if (updatingDog.Dogtype.Length > 0)
                {
                    updatingDog.Dogtype[0] = string.Join(",", item.Dogtype);
                }
                else
                {
                    Dog newDog = new Dog
                    {
                        DogNameForUpdate = item.DogNameForUpdate,
                        DogName = item.DogName,
                        Dogtype = new string[] { item.Dogtype[0] }
                    };
                    dogs.Remove(updatingDog);
                    dogs.Add(newDog);
                  //  newDog.Dogtype = updatingDog.Dogtype.Where(x => !string.IsNullOrEmpty(x)).ToArray();
                    WriteObjectToFile(dogs.ToList());
                    return true;
                }
                updatingDog.Dogtype = updatingDog.Dogtype.Where(x => !string.IsNullOrEmpty(x)).ToArray();
                WriteObjectToFile(dogs.ToList());
                return true;
            }catch(Exception ex)
            {
                log.Error(ex);
                return false;
            }
        }

        private T DictionaryToObject<T>(KeyValuePair<string, string[]> key) where T : new()
        {
            try
            {
                var t = new T();
                PropertyInfo[] properties = t.GetType().GetProperties();

                foreach (PropertyInfo property in properties)
                {

                    KeyValuePair<string, string[]> item = key;

                    // Find which property type (int, string, double? etc) the CURRENT property is...
                    Type tPropertyType = t.GetType().GetProperty(property.Name).PropertyType;

                    // ...and change the type (this is hacky.......I know :-( )
                    if (tPropertyType == typeof(string))
                    {
                        object newA = Convert.ChangeType(item.Key, tPropertyType);
                        t.GetType().GetProperty(property.Name).SetValue(t, newA, null);
                    }
                    else if (tPropertyType == typeof(string[]))
                    {
                        object newA = Convert.ChangeType(item.Value, tPropertyType);
                        t.GetType().GetProperty(property.Name).SetValue(t, newA, null);
                    }

                }
                return t;
            }catch(Exception ex)
            {
                log.Error(ex);
                throw ex;
            }
        }

        private IDictionary<string, object> ObjectToDictionary(List<Dog> d)
        {
            try { 
            IDictionary<string, object> dict = new Dictionary<string, object>();
            foreach(Dog dog in d)
            {
                dict.Add(dog.DogName, dog.Dogtype.ToArray());
            }
            return dict;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw ex;
            }
        }

        /// <summary>
        /// Once done manipulating the object map, pass it in here to persist
        /// </summary>
        /// <param name="dogs"></param>
        private void WriteObjectToFile(List<Dog> dogs)
        {
            try { 
            string relativePath = AppDomain.CurrentDomain.BaseDirectory + "Models/";
            IDictionary<string, object> dict = ObjectToDictionary(dogs.ToList());
            string jsonFile = JsonConvert.SerializeObject(dict);
            System.IO.File.WriteAllText(relativePath + "dogs.json", jsonFile);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw ex;
            }
        }
    }
}

