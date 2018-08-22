using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogsAPI2.Services.Models
{
  public   class Account
    {       
        public int CustomerId { get; set; }
        public int AccountNumber { get; set; }
        public string AccountType { get; set; }
        public double  MinBalance { get; set; }
        public string  BranchName { get; set; }
        public DateTime DateOfOpening { get; set; }
        public double CurrentBalance { get; set; }
    }
}
