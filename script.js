// ==========================================
// Student Budget & Expense Planner
// ==========================================

// Get saved data from LocalStorage
let budget = Number(localStorage.getItem("studentBudget")) || 0;

let expenses = JSON.parse(
    localStorage.getItem("studentExpenses")
) || [];


// ==========================================
// DOM Elements
// ==========================================

const budgetForm = document.getElementById("budgetForm");
const budgetAmount = document.getElementById("budgetAmount");

const expenseForm = document.getElementById("expenseForm");
const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");

const totalBudget = document.getElementById("totalBudget");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");
const totalTransactions = document.getElementById("totalTransactions");

const expenseTableBody = document.getElementById("expenseTableBody");

const searchExpense = document.getElementById("searchExpense");

const progressFill = document.getElementById("progressFill");
const budgetPercentage = document.getElementById("budgetPercentage");
const budgetStatus = document.getElementById("budgetStatus");

const categorySummary = document.getElementById("categorySummary");

const budgetMessage = document.getElementById("budgetMessage");
const expenseMessage = document.getElementById("expenseMessage");


// ==========================================
// Set Today's Date
// ==========================================

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

expenseDate.value = `${year}-${month}-${day}`;


// ==========================================
// Format Currency
// ==========================================

function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// ==========================================
// Save Data
// ==========================================

function saveData() {
    localStorage.setItem("studentBudget", budget);
    localStorage.setItem(
        "studentExpenses",
        JSON.stringify(expenses)
    );
}


// ==========================================
// Calculate Total Expenses
// ==========================================

function calculateTotalExpenses() {
    return expenses.reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );
}


// ==========================================
// Update Dashboard
// ==========================================

function updateDashboard() {

    const total = calculateTotalExpenses();
    const balance = budget - total;

    totalBudget.textContent = formatCurrency(budget);

    totalExpenses.textContent = formatCurrency(total);

    remainingBalance.textContent = formatCurrency(balance);

    totalTransactions.textContent = expenses.length;

    // Change balance text color
    if (balance < 0) {
        remainingBalance.style.color = "#dc2626";
    } else {
        remainingBalance.style.color = "#16a34a";
    }

    updateProgress();

    renderCategorySummary();
}


// ==========================================
// Budget Form
// ==========================================

budgetForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = Number(budgetAmount.value);

    if (amount <= 0) {
        budgetMessage.textContent =
            "Please enter a valid budget amount.";

        budgetMessage.style.color = "#dc2626";

        return;
    }

    budget = amount;

    saveData();

    updateDashboard();

    budgetMessage.textContent =
        "Budget updated successfully!";

    budgetMessage.style.color = "#16a34a";

    budgetAmount.value = "";
});


// ==========================================
// Expense Form
// ==========================================

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = expenseTitle.value.trim();

    const amount = Number(expenseAmount.value);

    const category = expenseCategory.value;

    const date = expenseDate.value;


    if (!title || amount <= 0 || !category || !date) {

        expenseMessage.textContent =
            "Please fill all fields correctly.";

        expenseMessage.style.color = "#dc2626";

        return;
    }


    const expense = {

        id: Date.now(),

        title: title,

        amount: amount,

        category: category,

        date: date

    };


    expenses.push(expense);

    saveData();

    updateDashboard();

    renderExpenses();


    expenseMessage.textContent =
        "Expense added successfully!";

    expenseMessage.style.color = "#16a34a";


    expenseForm.reset();

    expenseDate.value = `${year}-${month}-${day}`;

});


// ==========================================
// Render Expenses
// ==========================================

function renderExpenses() {

    const searchValue =
        searchExpense.value.toLowerCase().trim();


    const filteredExpenses = expenses.filter(function(expense) {

        return (
            expense.title.toLowerCase().includes(searchValue) ||
            expense.category.toLowerCase().includes(searchValue) ||
            expense.date.includes(searchValue)
        );

    });


    if (filteredExpenses.length === 0) {

        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No expenses found.
                </td>
            </tr>
        `;

        return;
    }


    expenseTableBody.innerHTML = "";


    // Show latest expense first
    const sortedExpenses = [...filteredExpenses].reverse();


    sortedExpenses.forEach(function(expense) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${escapeHTML(expense.title)}</strong>
            </td>

            <td>
                ${escapeHTML(expense.category)}
            </td>

            <td>
                ${formatDate(expense.date)}
            </td>

            <td>
                <strong>${formatCurrency(expense.amount)}</strong>
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </td>

        `;


        expenseTableBody.appendChild(row);

    });

}


// ==========================================
// Delete Expense
// ==========================================

function deleteExpense(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );


    if (!confirmDelete) {
        return;
    }


    expenses = expenses.filter(function(expense) {

        return expense.id !== id;

    });


    saveData();

    updateDashboard();

    renderExpenses();


    expenseMessage.textContent =
        "Expense deleted successfully.";

    expenseMessage.style.color = "#16a34a";
}


// ==========================================
// Search Expenses
// ==========================================

searchExpense.addEventListener("input", function() {

    renderExpenses();

});


// ==========================================
// Budget Progress
// ==========================================

function updateProgress() {

    const total = calculateTotalExpenses();


    if (budget <= 0) {

        progressFill.style.width = "0%";

        budgetPercentage.textContent = "0%";

        budgetStatus.textContent =
            "No budget set.";

        return;
    }


    let percentage =
        (total / budget) * 100;


    let displayPercentage =
        Math.round(percentage);


    budgetPercentage.textContent =
        displayPercentage + "%";


    // Limit progress bar width to 100%
    const barPercentage =
        Math.min(percentage, 100);

    progressFill.style.width =
        barPercentage + "%";


    if (percentage >= 100) {

        budgetStatus.textContent =
            "Warning: You have exceeded your budget.";

        progressFill.style.background =
            "#dc2626";

    } else if (percentage >= 80) {

        budgetStatus.textContent =
            "Careful! You are close to your budget limit.";

        progressFill.style.background =
            "#ea580c";

    } else {

        budgetStatus.textContent =
            "Good! Your spending is under control.";

        progressFill.style.background =
            "#16a34a";
    }

}


// ==========================================
// Category Summary
// ==========================================

function renderCategorySummary() {

    if (expenses.length === 0) {

        categorySummary.innerHTML = `
            <p class="empty">
                No expense data available.
            </p>
        `;

        return;
    }


    const categories = {};


    expenses.forEach(function(expense) {

        if (!categories[expense.category]) {

            categories[expense.category] = 0;

        }

        categories[expense.category] +=
            Number(expense.amount);

    });


    categorySummary.innerHTML = "";


    Object.keys(categories).forEach(function(category) {

        const card =
            document.createElement("div");

        card.className =
            "category-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(category)}
            </h3>

            <p>
                ${formatCurrency(categories[category])}
            </p>

        `;


        categorySummary.appendChild(card);

    });

}


// ==========================================
// Format Date
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// Prevent HTML Injection
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ==========================================
// Initial Load
// ==========================================

updateDashboard();

renderExpenses();
