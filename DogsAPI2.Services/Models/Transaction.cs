using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogsAPI2.Services.Models
{
    public class Transaction
    {
        public int Transction { get; set; }
        public int FromAccount { get; set; }
        public int ToAccount { get; set; }
        public TransactionType TypeOfTransaction { get; set; }
        public DateTime TransctionDate { get; set; }
        public double TransactionAmount { get; set; }
        public bool IsSelected { get; set; }

    }

    public enum TransactionType
    {
        OwnAccountTransfer,
        IntraBankTransfer,
        InterBankTransfer
    }
}
