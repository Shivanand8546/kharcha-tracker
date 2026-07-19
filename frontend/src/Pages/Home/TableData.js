import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const handleEditClick = (itemKey) => {
    // const buttonId = e.target.id;
    console.log("Clicked button ID:", itemKey);
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      handleShow();
    }
  };

  const handleEditSubmit = async (e) => {
    // e.preventDefault();

    const {data} = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });

    if(data.success === true){

      await handleClose();
      await setRefresh(!refresh);
      window.location.reload();
    }
    else{
      console.log("error");
    }

  }

  const handleDeleteClick = async (itemKey) => {
    console.log(user._id);
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);
    const {data} = await axios.post(`${deleteTransactions}/${itemKey}`,{
      userId: props.user._id,
    });

    if(data.success === true){
      await setRefresh(!refresh);
      window.location.reload();
    }
    else{
      console.log("error");
    }

  };

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

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data,props.user, refresh]);

  return (
    <>
      <Container>
        {props.data.length === 0 ? (
          <div className="emptyState">No transactions yet — add your first one</div>
        ) : (
          props.data.map((item, index) => (
            <div className="transactionCard" key={item._id}>
              <div className="transactionLeft">
                <div
                  className={`transactionIcon ${
                    item.transactionType === "credit" ? "credit" : "expense"
                  }`}
                >
                  {item.category ? item.category.charAt(0) : "?"}
                </div>
                <div>
                  <div className="transactionTitle">{item.title}</div>
                  <div className="transactionMeta">
                    {moment(item.date).format("DD MMM YYYY")} &bull; {item.category}
                  </div>
                </div>
              </div>

              <div className="transactionActions">
                <span
                  className={`transactionAmount ${
                    item.transactionType === "credit" ? "credit" : "expense"
                  }`}
                >
                  {item.transactionType === "credit" ? "+ " : "- "}
                  {item.amount}
                </span>
                <EditNoteIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleEditClick(item._id)}
                />
                <DeleteForeverIcon
                  sx={{ color: "#f0a5a5", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(item._id)}
                />
              </div>

              {editingTransaction && editingTransaction[0]._id === item._id ? (
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Transaction Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder={editingTransaction[0].title}
                          value={values.title}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder={editingTransaction[0].amount}
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
                          <option value="">{editingTransaction[0].category}</option>
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
                          placeholder={editingTransaction[0].description}
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
                          <option value={editingTransaction[0].transactionType}>
                            {editingTransaction[0].transactionType}
                          </option>
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
                    <Button variant="primary" type="submit" onClick={handleEditSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              ) : null}
            </div>
          ))
        )}
      </Container>
    </>
  );
};

export default TableData;