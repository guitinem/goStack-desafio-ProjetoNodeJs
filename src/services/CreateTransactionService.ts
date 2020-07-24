import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

/**
 * * Regras de negócios para aplicar:
 *
 * TODO [X] -> Checar se o valor passado em "value" é um number
 * TODO [X] -> Checar se type é income ou outcome
 * TODO [X] -> Quando valor é outcome, checar se o valor não ultrapassa o total
 *
 */

interface TransactionRequest {
  title: string;
  value: number;
  type: "income" | "outcome";
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: TransactionRequest): Transaction {

    if (!Number.isInteger(value)) {
      throw Error('Value passed must be a number');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw Error('Type passed not allowed');
    }

    if (type == 'outcome') {
      const { total } = this.transactionsRepository.getBalance();
      if ( value > total) {
        throw Error('Value do not be higher than total value');
      }
    }

    const transaction = this.transactionsRepository.create({ title, type, value })

    return transaction
  }
}

export default CreateTransactionService;
