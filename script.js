
const transactionList = JSON.parse(localStorage.getItem('transaction')) || [];
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
form.addEventListener('submit', addTransaction);

function updateTotal() {
    const incomeTotal = transactionList
        .filter(trx => trx.type === 'income')
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactionList
        .filter(trx => trx.type === 'expense')
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(balanceTotal);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(-expenseTotal);
}

function renderList() {
    list.innerHTML = '';
    status.textContent = ''
    if (transactionList.length === 0) {
        status.textContent = 'No transaction.';
        return;
    } 

    transactionList.forEach(({ id, name, amount, date, type }) => {
        const sign = type === 'income' ? 1 : -1;
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="amount ${type}">
                <span>${formatter.format(amount * sign)}</span>
            </div>
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;
        list.appendChild(li);
    });
}
function deleteTransaction(id) {
    const index = transactionList.findIndex((trx) => trx.id === id);
    if (index !== -1) {
        transactionList.splice(index, 1);
        saveTransaction();
        updateTotal();
        renderList();
    }
}
function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData(this);

    transactionList.push({
        id: Date.now(), 
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: formData.get('type') === 'on' ? 'income' : 'expense'
    });

    this.reset();
    updateTotal();
    saveTransaction();
    renderList();
}

function saveTransaction() {
    transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('transaction', JSON.stringify(transactionList));
}

updateTotal();
saveTransaction();
renderList();
