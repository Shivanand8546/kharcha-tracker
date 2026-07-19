import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    TotalTransactions > 0
      ? (totalIncomeTransactions.length / TotalTransactions) * 100
      : 0;
  let totalExpensePercent =
    TotalTransactions > 0
      ? (totalExpenseTransactions.length / TotalTransactions) * 100
      : 0;

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent =
    totalTurnOver > 0 ? (totalTurnOverIncome / totalTurnOver) * 100 : 0;
  const TurnOverExpensePercent =
    totalTurnOver > 0 ? (totalTurnOverExpense / totalTurnOver) * 100 : 0;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#FF6384",
    Rent: "#36A2EB",
    Salary: "#FFCE56",
    Tip: "#4BC0C0",
    Food: "#9966FF",
    Medical: "#FF9F40",
    Utilities: "#8AC926",
    Entertainment: "#6A4C93",
    Transportation: "#1982C4",
    Other: "#F45B69",
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="analyticsCard h-100">
              <div className="analyticsCardHeader">
                <span>Total Transactions:</span> {TotalTransactions}
              </div>
              <div className="analyticsCardBody">
                <h5 className="analyticsIncomeText">
                  Income: <ArrowDropUpIcon />
                  {totalIncomeTransactions.length}
                </h5>
                <h5 className="analyticsExpenseText">
                  Expense: <ArrowDropDownIcon />
                  {totalExpenseTransactions.length}
                </h5>

                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={totalIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <CircularProgressBar
                    percentage={totalExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="analyticsCard h-100">
              <div className="analyticsCardHeader">
                <span>Total TurnOver:</span> {totalTurnOver}
              </div>
              <div className="analyticsCardBody">
                <h5 className="analyticsIncomeText">
                  Income: <ArrowDropUpIcon /> {totalTurnOverIncome}{" "}
                  <CurrencyRupeeIcon />
                </h5>
                <h5 className="analyticsExpenseText">
                  Expense: <ArrowDropDownIcon />
                  {totalTurnOverExpense} <CurrencyRupeeIcon />
                </h5>
                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={TurnOverIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-4">
                  <CircularProgressBar
                    percentage={TurnOverExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="analyticsCard h-100">
              <div className="analyticsCardHeader">Categorywise Income</div>
              <div className="analyticsCardBody">
                {totalTurnOver === 0 ? (
                  <span className="analyticsEmptyText">No data yet</span>
                ) : (
                  categories.map((category) => {
                    const income = transactions
                      .filter(
                        (transaction) =>
                          transaction.transactionType === "credit" &&
                          transaction.category === category
                      )
                      .reduce(
                        (acc, transaction) => acc + transaction.amount,
                        0
                      );

                    const incomePercent = (income / totalTurnOver) * 100;

                    return (
                      <React.Fragment key={category}>
                        {income > 0 && (
                          <LineProgressBar
                            label={category}
                            percentage={incomePercent.toFixed(0)}
                            lineColor={colors[category]}
                          />
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="analyticsCard h-100">
              <div className="analyticsCardHeader">Categorywise Expense</div>
              <div className="analyticsCardBody">
                {totalTurnOver === 0 ? (
                  <span className="analyticsEmptyText">No data yet</span>
                ) : (
                  categories.map((category) => {
                    const expenses = transactions
                      .filter(
                        (transaction) =>
                          transaction.transactionType === "expense" &&
                          transaction.category === category
                      )
                      .reduce(
                        (acc, transaction) => acc + transaction.amount,
                        0
                      );

                    const expensePercent = (expenses / totalTurnOver) * 100;

                    return (
                      <React.Fragment key={category}>
                        {expenses > 0 && (
                          <LineProgressBar
                            label={category}
                            percentage={expensePercent.toFixed(0)}
                            lineColor={colors[category]}
                          />
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Analytics;