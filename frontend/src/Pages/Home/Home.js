import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import { getCategoryIcon } from "../../utils/categoryIcons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "../../components/Skeleton";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import Analytics from "./Analytics";
import moment from "moment";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { parseVoiceText } from "../../utils/voiceParser";
import { extractAmountFromImage } from "../../utils/receiptParser";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(
    Number(localStorage.getItem("monthlyBudget")) || 0
  );
  const [isListening, setIsListening] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (val) => {
    setType(val);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser", toastOptions);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      const parsed = parseVoiceText(spokenText);

      setValues((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        amount: parsed.amount || prev.amount,
        category: parsed.category || prev.category,
        transactionType: parsed.transactionType || prev.transactionType,
      }));

      toast.success("Voice captured — please review before submitting", toastOptions);
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error("Couldn't hear that, try again", toastOptions);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const { amount } = await extractAmountFromImage(file);
      if (amount) {
        setValues((prev) => ({ ...prev, amount }));
        toast.success("Amount detected — please review before submitting", toastOptions);
      } else {
        toast.error("Couldn't detect an amount, please enter manually", toastOptions);
      }
    } catch (err) {
      toast.error("Failed to read receipt", toastOptions);
    }
    setOcrLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } =
      values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    setLoading(true);

    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description,
      category: category,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });

    if (data.success === true) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });

        setTransactions(data.transactions);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  // ---- Derived summary numbers ----
  const totalIncome = transactions
    .filter((t) => t.transactionType === "credit")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const incomeSourceCount = new Set(
    transactions
      .filter((t) => t.transactionType === "credit")
      .map((t) => t.category)
  ).size;

  const expenseCategoryCount = new Set(
    transactions
      .filter((t) => t.transactionType === "expense")
      .map((t) => t.category)
  ).size;

  // ---- By Category (expenses) ----
  const categoryTotals = {};
  transactions
    .filter((t) => t.transactionType === "expense")
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    });
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxCategoryAmount = topCategories.length ? topCategories[0][1] : 1;

  // ---- Last 7 days ----
  const last7Days = [...Array(7)].map((_, i) => {
    const day = moment().subtract(6 - i, "days");
    const dayTotal = transactions
      .filter(
        (t) =>
          t.transactionType === "expense" &&
          moment(t.date).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
      )
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return { label: day.format("dd")[0], amount: dayTotal };
  });
  const maxDayAmount = Math.max(...last7Days.map((d) => d.amount), 1);

  // ---- Budget ----
  const budgetPercent =
    monthlyBudget > 0
      ? Math.min(Math.round((totalExpense / monthlyBudget) * 100), 100)
      : 0;

  const handleSetBudget = () => {
    const value = prompt("Set your monthly budget (Rs):", monthlyBudget || "");
    if (value !== null && !isNaN(value) && Number(value) >= 0) {
      setMonthlyBudget(Number(value));
      localStorage.setItem("monthlyBudget", value);
    }
  };

  // ---- Export CSV ----
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export", toastOptions);
      return;
    }
    const headers = ["Title", "Amount", "Category", "Type", "Date", "Description"];
    const rows = transactions.map((t) => [
      t.title,
      t.amount,
      t.category,
      t.transactionType,
      moment(t.date).format("YYYY-MM-DD"),
      t.description,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---- Search filter (applied on top of fetched transactions) ----
  const displayedTransactions = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      (t.description || "").toLowerCase().includes(term) ||
      (t.category || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
      />

      {loading ? (
        <Skeleton />
      ) : (
        <Container
          style={{ position: "relative", zIndex: "2 !important" }}
          className="mt-3"
        >
          {/* Top hero row */}
          <div className="heroRow">
            <div className="balanceCard">
              <div className="balanceLabel">💼 Current Balance</div>
              <div className="balanceValue">Rs {balance}</div>
              <div className="balanceSub">Compared to last period</div>
              <div className="balanceActions">
                <Button className="primaryActionBtn" onClick={handleShow}>
                  <AddIcon sx={{ fontSize: 18 }} /> Add Transaction
                </Button>
                <Button className="secondaryActionBtn" onClick={handleExport}>
                  <FileDownloadIcon sx={{ fontSize: 18 }} /> Export
                </Button>
              </div>
            </div>

            <div className="miniStatCard income">
              <div className="miniStatTop">
                <span className="miniStatIcon">📈</span>
                <span className="miniStatBadge">This period</span>
              </div>
              <div className="miniStatLabel">Total Income</div>
              <div className="miniStatValue">Rs {totalIncome}</div>
              <div className="miniStatFoot">↗ {incomeSourceCount} sources</div>
            </div>

            <div className="miniStatCard expense">
              <div className="miniStatTop">
                <span className="miniStatIcon">📉</span>
                <span className="miniStatBadge">This period</span>
              </div>
              <div className="miniStatLabel">Total Expense</div>
              <div className="miniStatValue">Rs {totalExpense}</div>
              <div className="miniStatFoot">↘ {expenseCategoryCount} categories</div>
            </div>
          </div>

          {/* Budget / Category / Last 7 days row */}
          <div className="statsRow">
            <div className="statsCard" onClick={handleSetBudget}>
              <div className="statsCardHeader">
                <span>🎯 Monthly Budget</span>
                <span className="statsCardHeaderRight">
                  Rs {monthlyBudget || "Set"}
                </span>
              </div>
              <div className="budgetPercent">{budgetPercent}%</div>
              <div className="budgetBarTrack">
                <div
                  className="budgetBarFill"
                  style={{ width: `${budgetPercent}%` }}
                ></div>
              </div>
              <div className="budgetFoot">
                Rs {Math.max(monthlyBudget - totalExpense, 0)} left
                {monthlyBudget === 0 && " · tap to set budget"}
              </div>
            </div>

            <div className="statsCard">
              <div className="statsCardHeader">
                <span>🥧 By Category</span>
                <span className="statsCardHeaderRight">Expenses</span>
              </div>
              {topCategories.length === 0 ? (
                <div className="statsEmptyText">No expenses yet</div>
              ) : (
                topCategories.map(([cat, amt]) => (
                  <div className="categoryBarRow" key={cat}>
                    <div className="categoryBarLabel">
                      <span>{cat}</span>
                      <span>Rs {amt}</span>
                    </div>
                    <div className="categoryBarTrack">
                      <div
                        className="categoryBarFill"
                        style={{
                          width: `${(amt / maxCategoryAmount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="statsCard">
              <div className="statsCardHeader">
                <span>📅 Last 7 Days</span>
                <span className="statsCardHeaderRight">Spend</span>
              </div>
              <div className="weekBarRow">
                {last7Days.map((d, i) => (
                  <div className="weekBarCol" key={i}>
                    <div
                      className="weekBarFill"
                      style={{
                        height: `${(d.amount / maxDayAmount) * 60 || 2}px`,
                      }}
                      title={`Rs ${d.amount}`}
                    ></div>
                    <span className="weekBarLabel">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters (frequency + view toggle) */}
          <div className="filterRow">
            <div className="text-white">
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select
                  name="frequency"
                  value={frequency}
                  onChange={handleChangeFrequency}
                >
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white iconBtnBox">
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={handleTableClick}
                className={`${view === "table" ? "iconActive" : "iconDeactive"}`}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={handleChartClick}
                className={`${view === "chart" ? "iconActive" : "iconDeactive"}`}
              />
            </div>

            <Button variant="primary" onClick={handleReset} className="resetBtn">
              Reset Filter
            </Button>
          </div>

          {frequency === "custom" && (
            <div className="date">
              <div className="form-group">
                <label htmlFor="startDate" className="text-white">
                  Start Date:
                </label>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="endDate" className="text-white">
                  End Date:
                </label>
                <div>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions section */}
          {view === "table" ? (
            <>
              <div className="recentHeader">
                <div>
                  <div className="recentTitle">Recent Transactions</div>
                  <div className="recentSub">
                    {displayedTransactions.length} entries
                  </div>
                </div>
                <div className="recentControls">
                  <div className="pillGroup">
                    <span
                      className={`pill ${type === "all" ? "pillActive" : ""}`}
                      onClick={() => handleSetType("all")}
                    >
                      All
                    </span>
                    <span
                      className={`pill ${type === "credit" ? "pillActive" : ""}`}
                      onClick={() => handleSetType("credit")}
                    >
                      Income
                    </span>
                    <span
                      className={`pill ${type === "expense" ? "pillActive" : ""}`}
                      onClick={() => handleSetType("expense")}
                    >
                      Expense
                    </span>
                  </div>
                  <Button onClick={handleShow} className="addNewBtn">
                    <AddIcon sx={{ fontSize: 16 }} /> Add New
                  </Button>
                </div>
              </div>

              <TableData data={displayedTransactions} user={cUser} />
            </>
          ) : (
            <Analytics transactions={displayedTransactions} user={cUser} />
          )}

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Transaction Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div className="quickAddRow">
                  <Button
                    type="button"
                    className={`quickAddBtn ${isListening ? "listening" : ""}`}
                    onClick={handleVoiceInput}
                  >
                    {isListening ? (
                      <MicOffIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <MicIcon sx={{ fontSize: 18 }} />
                    )}
                    {isListening ? "Listening..." : "Speak"}
                  </Button>

                  <label className="quickAddBtn quickAddUploadBtn">
                    <PhotoCameraIcon sx={{ fontSize: 18 }} />
                    {ocrLoading ? "Reading..." : "Scan Receipt"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      hidden
                      onChange={handleReceiptUpload}
                      disabled={ocrLoading}
                    />
                  </label>
                </div>

                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder="Enter Transaction Name"
                    value={values.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    placeholder="Enter your Amount"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSelect">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Rent">Rent</option>
                    <option value="Salary">Salary</option>
                    <option value="Tip">Tip</option>
                    <option value="Food">Food</option>
                    <option value="Medical">Medical</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSelect1">
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="credit">Credit</option>
                    <option value="expense">Expense</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Home;