// ============================================
// STUDENT BUDGET & EXPENSE PLANNER
// ============================================


// Expense categories
const categories = [
    {
        id: "food",
        name: "Food",
        emoji: "🍔"
    },
    {
        id: "travel",
        name: "Travel",
        emoji: "🚌"
    },
    {
        id: "hostel",
        name: "Hostel / Rent",
        emoji: "🏠"
    },
    {
        id: "education",
        name: "Education",
        emoji: "📚"
    },
    {
        id: "entertainment",
        name: "Entertainment",
        emoji: "🎮"
    },
    {
        id: "shopping",
        name: "Shopping",
        emoji: "🛍️"
    },
    {
        id: "health",
        name: "Health",
        emoji: "💊"
    },
    {
        id: "other",
        name: "Other",
        emoji: "📦"
    }
];


// ============================================
// DOM ELEMENTS
// ============================================

const incomeInput =
    document.getElementById("income");

const calculateBtn =
    document.getElementById("calculateBtn");

const resetBtn =
    document.getElementById("resetBtn");

const incomeResult =
    document.getElementById("incomeResult");

const expenseResult =
    document.getElementById("expenseResult");

const balanceResult =
    document.getElementById("balanceResult");

const statusResult =
    document.getElementById("statusResult");

const percentageResult =
    document.getElementById("percentageResult");

const progressFill =
    document.getElementById("progressFill");

const budgetMessage =
    document.getElementById("budgetMessage");

const categoryBreakdown =
    document.getElementById("categoryBreakdown");

const tipText =
    document.getElementById("tipText");


// ============================================
// FORMAT CURRENCY
// ============================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

}


// ============================================
// GET CATEGORY VALUES
// ============================================

function getExpenses() {

    const expenseData = {};

    categories.forEach(category => {

        const input =
            document.getElementById(category.id);

        let value =
            Number(input.value);

        if (isNaN(value) || value < 0) {
            value = 0;
        }

        expenseData[category.id] = value;

    });

    return expenseData;
}


// ============================================
// CALCULATE TOTAL
// ============================================

function calculateTotal(expenses) {

    return Object.values(expenses).reduce(
        (total, amount) => total + amount,
        0
    );

}


// ============================================
// GET FINANCIAL STATUS
// ============================================

function getFinancialStatus(
    income,
    expenses,
    balance
) {

    if (income <= 0) {

        return {
            text: "Not Calculated",
            type: "normal"
        };

    }


    if (expenses > income) {

        return {
            text: "Over Budget",
            type: "danger"
        };

    }


    const percentage =
        (expenses / income) * 100;


    if (percentage >= 90) {

        return {
            text: "Very High Spending",
            type: "danger"
        };

    }


    if (percentage >= 75) {

        return {
            text: "Be Careful",
            type: "warning"
        };

    }


    if (balance >= income * 0.20) {

        return {
            text: "Excellent",
            type: "success"
        };

    }


    return {
        text: "Good",
        type: "success"
    };

}


// ============================================
// CALCULATE BUDGET
// ============================================

function calculateBudget() {

    let income =
        Number(incomeInput.value);


    if (isNaN(income) || income < 0) {
        income = 0;
    }


    const expenses =
        getExpenses();


    const totalExpenses =
        calculateTotal(expenses);


    const balance =
        income - totalExpenses;


    let percentage = 0;


    if (income > 0) {

        percentage =
            (totalExpenses / income) * 100;

    }


    const status =
        getFinancialStatus(
            income,
            totalExpenses,
            balance
        );


    // ========================================
    // UPDATE SUMMARY
    // ========================================

    incomeResult.textContent =
        formatCurrency(income);


    expenseResult.textContent =
        formatCurrency(totalExpenses);


    balanceResult.textContent =
        formatCurrency(balance);


    statusResult.textContent =
        status.text;


    percentageResult.textContent =
        Math.round(percentage) + "%";


    // ========================================
    // BALANCE COLOR
    // ========================================

    if (balance < 0) {

        balanceResult.style.color =
            "#dc2626";

    } else {

        balanceResult.style.color =
            "#4f46e5";

    }


    // ========================================
    // STATUS COLOR
    // ========================================

    if (status.type === "danger") {

        statusResult.style.color =
            "#dc2626";

    } else if (status.type === "warning") {

        statusResult.style.color =
            "#ea580c";

    } else if (status.type === "success") {

        statusResult.style.color =
            "#16a34a";

    } else {

        statusResult.style.color =
            "#ea580c";

    }


    // ========================================
    // PROGRESS BAR
    // ========================================

    const progress =
        Math.min(percentage, 100);


    progressFill.style.width =
        progress + "%";


    if (percentage > 100) {

        progressFill.style.background =
            "#dc2626";

    } else if (percentage >= 75) {

        progressFill.style.background =
            "#ea580c";

    } else {

        progressFill.style.background =
            "linear-gradient(90deg, #4f46e5, #7c3aed)";

    }


    // ========================================
    // BUDGET MESSAGE
    // ========================================

    if (income === 0) {

        budgetMessage.textContent =
            "Please enter your monthly income.";

    } else if (totalExpenses > income) {

        budgetMessage.textContent =
            "⚠️ Your planned expenses are higher than your income.";

    } else if (percentage >= 90) {

        budgetMessage.textContent =
            "⚠️ You are using almost all of your monthly income.";

    } else if (percentage >= 75) {

        budgetMessage.textContent =
            "💡 Your spending is high. Try to reduce unnecessary expenses.";

    } else {

        budgetMessage.textContent =
            "✅ Good! Your planned expenses are within your income.";

    }


    // ========================================
    // CATEGORY BREAKDOWN
    // ========================================

    renderBreakdown(
        expenses,
        totalExpenses
    );


    // ========================================
    // SAVING TIP
    // ========================================

    updateSavingTip(
        income,
        totalExpenses,
        balance
    );


    // ========================================
    // SAVE DATA
    // ========================================

    saveData(
        income,
        expenses
    );

}


// ============================================
// CATEGORY BREAKDOWN
// ============================================

function renderBreakdown(
    expenses,
    totalExpenses
) {

    if (totalExpenses === 0) {

        categoryBreakdown.innerHTML = `
            <p class="empty-message">
                No expenses entered yet.
            </p>
        `;

        return;
    }


    categoryBreakdown.innerHTML = "";


    categories.forEach(category => {

        const amount =
            expenses[category.id];


        if (amount <= 0) {
            return;
        }


        const percentage =
            (amount / totalExpenses) * 100;


        const row =
            document.createElement("div");


        row.className =
            "breakdown-row";


        row.innerHTML = `

            <div class="breakdown-name">
                ${category.emoji}
                ${category.name}
            </div>

            <div class="breakdown-amount">
                ${formatCurrency(amount)}
            </div>

            <div class="breakdown-progress">

                <span
                    style="width: ${percentage}%"
                ></span>

            </div>

        `;


        categoryBreakdown.appendChild(row);

    });

}


// ============================================
// SAVING TIP
// ============================================

function updateSavingTip(
    income,
    expenses,
    balance
) {

    if (income <= 0) {

        tipText.textContent =
            "Enter your income to get a personalized money-saving tip.";

        return;
    }


    if (balance < 0) {

        tipText.textContent =
            "Your expenses are higher than your income. Try reducing shopping, entertainment, or other unnecessary expenses.";

        return;
    }


    const savingPercentage =
        (balance / income) * 100;


    if (savingPercentage >= 30) {

        tipText.textContent =
            "Excellent! You are keeping more than 30% of your income. Keep building your savings.";

    } else if (savingPercentage >= 20) {

        tipText.textContent =
            "Great job! You are saving around 20% or more. Continue maintaining this habit.";

    } else if (savingPercentage >= 10) {

        tipText.textContent =
            "Good start! Try to increase your savings gradually to 20% of your income.";

    } else {

        tipText.textContent =
            "Try to reduce unnecessary expenses and aim to save at least 10% of your monthly income.";

    }

}


// ============================================
// SAVE DATA TO LOCAL STORAGE
// ============================================

function saveData(
    income,
    expenses
) {

    const data = {

        income: income,

        expenses: expenses

    };


    localStorage.setItem(
        "studentBudgetPlanner",
        JSON.stringify(data)
    );

}


// ============================================
// LOAD DATA
// ============================================

function loadData() {

    const savedData =
        localStorage.getItem(
            "studentBudgetPlanner"
        );


    if (!savedData) {
        return;
    }


    try {

        const data =
            JSON.parse(savedData);


        if (typeof data.income === "number") {

            incomeInput.value =
                data.income || "";

        }


        if (data.expenses) {

            categories.forEach(category => {

                const input =
                    document.getElementById(
                        category.id
                    );


                if (
                    typeof data.expenses[
                        category.id
                    ] === "number"
                ) {

                    input.value =
                        data.expenses[
                            category.id
                        ];

                }

            });

        }


        calculateBudget();


    } catch (error) {

        console.log(
            "Unable to load saved data."
        );

    }

}


// ============================================
// RESET
// ============================================

function resetPlanner() {

    const confirmReset =
        confirm(
            "Are you sure you want to reset your budget?"
        );


    if (!confirmReset) {
        return;
    }


    incomeInput.value = "";


    categories.forEach(category => {

        document.getElementById(
            category.id
        ).value = 0;

    });


    incomeResult.textContent =
        "₹0";


    expenseResult.textContent =
        "₹0";


    balanceResult.textContent =
        "₹0";


    statusResult.textContent =
        "Not Calculated";


    percentageResult.textContent =
        "0%";


    progressFill.style.width =
        "0%";


    progressFill.style.background =
        "linear-gradient(90deg, #4f46e5, #7c3aed)";


    budgetMessage.textContent =
        "Enter your income and expenses to calculate your budget.";


    categoryBreakdown.innerHTML = `
        <p class="empty-message">
            Calculate your budget to see the breakdown.
        </p>
    `;


    tipText.textContent =
        "Try to save at least 10% of your monthly income whenever possible.";


    localStorage.removeItem(
        "studentBudgetPlanner"
    );

}


// ============================================
// BUTTON EVENTS
// ============================================

calculateBtn.addEventListener(
    "click",
    calculateBudget
);


resetBtn.addEventListener(
    "click",
    resetPlanner
);


// ============================================
// AUTO CALCULATE WHEN INPUT CHANGES
// ============================================

incomeInput.addEventListener(
    "input",
    calculateBudget
);


categories.forEach(category => {

    const input =
        document.getElementById(
            category.id
        );


    input.addEventListener(
        "input",
        calculateBudget
    );

});


// ============================================
// LOAD SAVED DATA ON PAGE OPEN
// ============================================

loadData();
